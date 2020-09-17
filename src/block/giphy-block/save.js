import { getBlockDefaultClassName } from '@wordpress/blocks';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @author WebDevStudios
 * @since 0.0.1
 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @param {Object} [props] Properties passed from the editor.
 * @return {WPElement} Element to render.
 */
export default function Save( props ) {
	const {
		attributes: {
			selectedGif,
			gifAlign,
		},
	} = props;

	return (
		<div className={ `${ getBlockDefaultClassName( 'ashar-irfan/giphy-block' ) } ${ gifAlign }` }>
			{ selectedGif.hasOwnProperty( 'url' ) ? (
				<img src={ selectedGif.url } alt={ selectedGif.title } />
			) : false }
		</div>
	);
}
