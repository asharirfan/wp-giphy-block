<?php
/**
 * Plugin Name:     Giphy Block
 * Description:     A block for displaying GIFs from Giphy.com in Gutenberg.
 * Version:         0.1.0
 * Author:          Ashar Irfan
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     giphy-block
 *
 * @package AsharIrfan\GiphyBlock
 * @since 0.1.0
 */

namespace AsharIrfan\GiphyBlock;

use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Register the block with WordPress.
 *
 * @author AsharIrfan
 * @since 0.1.0
 */
function register_block() {

	// Define our assets.
	$editor_script   = 'build/index.js';
	$editor_style    = 'build/index.css';
	$frontend_style  = 'build/style-index.css';
	$frontend_script = 'build/frontend.js';

	// Verify we have an editor script.
	if ( ! file_exists( plugin_dir_path( __FILE__ ) . $editor_script ) ) {
		wp_die( esc_html__( 'Whoops! You need to run `npm run build` for the Giphy Block first.', 'giphy-block' ) );
	}

	// Autoload dependencies and version.
	$asset_file = require plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	// Register editor script.
	wp_register_script(
		'ashar-irfan-giphy-block-editor-script',
		plugins_url( $editor_script, __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_localize_script(
		'ashar-irfan-giphy-block-editor-script',
		'wpGiphyBlockData',
		[
			'security' => wp_create_nonce( 'wp_rest' ),
		]
	);

	// Register editor style.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $editor_style ) ) {
		wp_register_style(
			'ashar-irfan-giphy-block-editor-style',
			plugins_url( $editor_style, __FILE__ ),
			[ 'wp-edit-blocks' ],
			filemtime( plugin_dir_path( __FILE__ ) . $editor_style )
		);
	}

	// Register frontend style.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $frontend_style ) ) {
		wp_register_style(
			'ashar-irfan-giphy-block-style',
			plugins_url( $frontend_style, __FILE__ ),
			[],
			filemtime( plugin_dir_path( __FILE__ ) . $frontend_style )
		);
	}

	// Register block with WordPress.
	register_block_type(
		'ashar-irfan/giphy-block',
		array(
			'editor_script' => 'ashar-irfan-giphy-block-editor-script',
			'editor_style'  => 'ashar-irfan-giphy-block-editor-style',
			'style'         => 'ashar-irfan-giphy-block-style',
		)
	);

	// Register frontend script.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $frontend_script ) ) {
		wp_enqueue_script(
			'ashar-irfan-giphy-block-frontend-script',
			plugins_url( $frontend_script, __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}
}
add_action( 'init', __NAMESPACE__ . '\register_block' );

/**
 * Register REST routes for block.
 *
 * @author Ashar Irfan
 * @since 0.1.0
 */
function register_rest_routes() {
	register_rest_route(
		'ashar-irfan/wp-giphy-block/v1',
		'/option/(?P<option>([A-Za-z\_])+)/',
		[
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => __NAMESPACE__ . '\get_giphy_option',
				'permission_callback' => __NAMESPACE__ . '\rest_authenticate',
				'args'                => [
					'option' => [
						'validate_callback' => function( $param ) {
							return is_string( $param );
						},
					],
				],
			],
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => __NAMESPACE__ . '\update_giphy_option',
				'permission_callback' => __NAMESPACE__ . '\rest_authenticate',
				'args'                => [
					'option' => [
						'validate_callback' => function( $param ) {
							return is_string( $param );
						},
					],
				],
			],
		]
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_rest_routes' );

/**
 * Get block option via REST API.
 *
 * @author Ashar Irfan
 * @since 0.1.0
 *
 * @param WP_REST_Request $request REST API request object.
 * @return WP_Error|WP_REST_Response
 */
function get_giphy_option( WP_REST_Request $request ) {
	$option_name = $request->get_param( 'option' );

	if ( ! is_string( $option_name ) ) {
		return new WP_Error(
			'invalid_option_name',
			esc_html__( 'Invalid option name', 'giphy-block' )
		);
	}

	return new WP_REST_Response(
		get_option( $option_name, '' ),
		200
	);
}

/**
 * Get block option via REST API.
 *
 * @author Ashar Irfan
 * @since 0.1.0
 *
 * @param WP_REST_Request $request REST API request object.
 * @return WP_Error|WP_REST_Response
 */
function update_giphy_option( WP_REST_Request $request ) {
	$option_name = $request->get_param( 'option' );

	if ( ! is_string( $option_name ) ) {
		return new WP_Error(
			'invalid_option_name',
			esc_html__( 'Invalid option name', 'giphy-block' )
		);
	}

	$request_json = $request->get_json_params();
	$option_value = $request_json['option_value'] ?? '';

	return new WP_REST_Response(
		update_option( $option_name, $option_value ),
		200
	);
}

/**
 * Check if the current user has permissions to publish posts.
 *
 * @author Ashar Irfan
 * @since 0.1.0
 *
 * @return boolean
 */
function rest_authenticate() {
	return current_user_can( 'publish_posts' );
}
