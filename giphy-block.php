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
