import { Button, Card, CardBody, TextControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import axios from 'axios';

// import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @author AsharIrfan
 * @since 0.1.0
 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param {Object} [props] Properties passed from the editor.
 * @return {WPElement} Element to render.
 */
export default function Edit( props ) {
	const {
		attributes: {
			searchActive,
			searchResults,
			selectedGif,
		},
		className,
		setAttributes,
	} = props;

	const searchGiphy = ( query ) => {
		if ( ! query ) {
			return;
		}

		setAttributes( { searchActive: true, searchResults: [] } );

		try {
			const fetch = axios( {
				url: `https://api.giphy.com/v1/gifs/search?api_key=cpiNEMWpw4D3DXaT4QIu7A8RZCnupclo&q=${ query }&limit=25&offset=0&rating=r&lang=en`,
				method: 'GET',
				credentials: 'same-origin',
			} );
			fetch.then( ( response ) => {
				setAttributes( { searchActive: false } );

				if ( 200 !== response.status ) {
					return;
				}

				const results = response.data.data.reduce( ( gifs, currentGif ) => {
					gifs.push( {
						url: currentGif.images.original.url,
						title: currentGif.title,
					} );
					return gifs;
				}, [] );

				setAttributes( { searchResults: results } );
			} );
		} catch ( error ) {
			console.log( error ); // eslint-disable-line no-console
		}
	};

	const setSelectedGif = ( gif ) => {
		const selected = [];
		selected.url = gif.url;
		selected.title = gif.title;
		setAttributes( { selectedGif: selected, searchResults: [] } );
	};

	return (
		<div className={ className }>
			<Card className="giphy-block-search">
				<CardBody>
					<TextControl
						label={ __( 'Giphy Block', 'giphy-block' ) }
						placeholder={ __( 'Search for GIFs here...', 'giphy-block' ) }
						onChange={ searchGiphy }
					/>
					{ searchActive && ( <Spinner /> ) }
				</CardBody>
			</Card>
			{ 0 !== searchResults.length ? (
				<Card className="giphy-block-search-results">
					{ searchResults.map( ( gif, index ) => {
						return (
							<div key={ index }>
								<Button
									onClick={ () => setSelectedGif( gif ) }
									style={ {
										display: 'block',
										width: '100%',
										height: '100%',
									} }
								>
									<img src={ gif.url } alt={ gif.title } />
								</Button>
							</div>
						);
					} ) }
				</Card>
			) : false }
			{ 0 !== selectedGif.length ? (
				<Card>
					<CardBody>
						<img src={ selectedGif.url } alt={ selectedGif.title } />
					</CardBody>
				</Card>
			) : false }
		</div>
	);
}
