import edit from './edit';
import save from './save';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

/**
 * Register block type definition.
 *
 * @author WebDevStudios
 * @since 0.0.1
 * @link https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'ashar-irfan/giphy-block', {
	title: __( 'AsharIrfan Giphy Block', 'giphy-block' ),
	icon: 'edit',
	category: 'common',
	keywords: [
		__( 'AsharIrfan', 'giphy-block' ),
		__( 'GiphyBlock', 'giphy-block' ),
	],
	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'p',
		},
	},
	edit,
	save,
} );
