import {
	Button,
	Card,
	CardBody,
	TextControl,
	Spinner,
	Panel,
	PanelBody,
	PanelRow,
	SelectControl,
	Toolbar,
	DropdownMenu,
	ToolbarButton,
} from '@wordpress/components';
import {
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import {
	useEffect,
	useState,
	useRef,
} from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import axios from 'axios';
import './editor.scss';
import GiphyInputControl from '../../utils/components/giphy-text-control';

/* global wpGiphyBlockData */

const getGiphyApiKey = async () => {
	const request = await axios( {
		url: `${ wpGiphyBlockData.optionEndpoint }`,
		method: 'GET',
		headers: {
			'X-WP-Nonce': wpGiphyBlockData.security,
		},
	} );

	if ( 200 !== request.status ) {
		return '';
	}

	return request.data;
};

const updateGiphyApiKey = async ( apiKey, saveBtn ) => {
	saveBtn.disabled = true;

	const request = await axios( {
		url: `${ wpGiphyBlockData.optionEndpoint }`,
		method: 'POST',
		headers: {
			'X-WP-Nonce': wpGiphyBlockData.security,
		},
		data: {
			option_value: apiKey,
		},
	} );

	saveBtn.disabled = false;

	if ( 200 !== request.status || ( ! request.data ) ) {
		return false;
	}

	dispatch( 'core/notices' ).createSuccessNotice( __( 'API saved successfully', 'giphy-block' ) );

	return true;
};

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
			searchLimit,
			searchRating,
			searchLang,
			gifAlign,
			isEditing,
		},
		className,
		setAttributes,
	} = props;

	const [ giphyApiKey, setGiphyApiKey ] = useState( '' );
	const apiKeyInputRef = useRef( '' );

	const searchGiphy = ( query ) => {
		if ( ! query ) {
			setAttributes( { searchResults: [] } );
			return;
		}

		setAttributes( { searchActive: true, searchResults: [], selectedGif: {} } );

		try {
			const giphyApiEndpoint = addQueryArgs(
				'https://api.giphy.com/v1/gifs/search',
				{
					api_key: giphyApiKey,
					q: query,
					limit: searchLimit,
					offset: 0,
					rating: searchRating,
					lang: searchLang,
				}
			);

			const fetch = axios( {
				url: giphyApiEndpoint,
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
		setAttributes( { selectedGif: gif, searchResults: [], isEditing: false } );
	};

	const ratingOptions = [
		{ value: null, label: __( 'Select a rating', 'giphy-block' ), disabled: true },
		{ value: 'g', label: __( 'G', 'giphy-block' ) },
		{ value: 'pg', label: __( 'PG', 'giphy-block' ) },
		{ value: 'pg-13', label: __( 'PG-13', 'giphy-block' ) },
		{ value: 'r', label: __( 'R', 'giphy-block' ) },
	];

	const languageOptions = [
		{ value: null, label: __( 'Select a language', 'giphy-block' ), disabled: true },
		{ value: 'en', label: __( 'English (en)', 'giphy-block' ) },
		{ value: 'es', label: __( 'Spanish (es)', 'giphy-block' ) },
		{ value: 'pt', label: __( 'Portuguese (pt)', 'giphy-block' ) },
		{ value: 'id', label: __( 'Indonesian (id)', 'giphy-block' ) },
		{ value: 'fr', label: __( 'French (fr)', 'giphy-block' ) },
		{ value: 'ar', label: __( 'Arabic (ar)', 'giphy-block' ) },
		{ value: 'tr', label: __( 'Turkish (tr)', 'giphy-block' ) },
		{ value: 'th', label: __( 'Thai (th)', 'giphy-block' ) },
		{ value: 'vi', label: __( 'Vietnamese (vi)', 'giphy-block' ) },
		{ value: 'de', label: __( 'German (de)', 'giphy-block' ) },
		{ value: 'it', label: __( 'Italian (it)', 'giphy-block' ) },
		{ value: 'ja', label: __( 'Japanese (ja)', 'giphy-block' ) },
		{ value: 'zh-CN', label: __( 'Chinese Simplified (zh-CN)', 'giphy-block' ) },
		{ value: 'zh-TW', label: __( 'Chinese Traditional (zh-TW)', 'giphy-block' ) },
		{ value: 'ru', label: __( 'Russian (ru)', 'giphy-block' ) },
		{ value: 'ko', label: __( 'Korean (ko)', 'giphy-block' ) },
		{ value: 'pl', label: __( 'Polish (pl)', 'giphy-block' ) },
		{ value: 'nl', label: __( 'Dutch (nl)', 'giphy-block' ) },
		{ value: 'ro', label: __( 'Romanian (ro)', 'giphy-block' ) },
		{ value: 'hu', label: __( 'Hungarian (hu)', 'giphy-block' ) },
		{ value: 'sv', label: __( 'Swedish (sv)', 'giphy-block' ) },
		{ value: 'cs', label: __( 'Czech (cs)', 'giphy-block' ) },
		{ value: 'hi', label: __( 'Hindi (hi)', 'giphy-block' ) },
		{ value: 'bn', label: __( 'Bengali (bn)', 'giphy-block' ) },
		{ value: 'da', label: __( 'Danish (da)', 'giphy-block' ) },
		{ value: 'fa', label: __( 'Farsi (fa)', 'giphy-block' ) },
		{ value: 'tl', label: __( 'Filipino (tl)', 'giphy-block' ) },
		{ value: 'fi', label: __( 'Finnish (fi)', 'giphy-block' ) },
		{ value: 'iw', label: __( 'Hebrew (iw)', 'giphy-block' ) },
		{ value: 'ms', label: __( 'Malay (ms)', 'giphy-block' ) },
		{ value: 'no', label: __( 'Norwegian (no)', 'giphy-block' ) },
		{ value: 'uk', label: __( 'Ukrainian (uk)', 'giphy-block' ) },
	];

	const layouts = {
		left: {
			title: __( 'Align Left', 'giphy-block' ),
			icon: 'editor-alignleft',
			value: 'left',
		},
		center: {
			title: __( 'Align Center', 'giphy-block' ),
			icon: 'editor-aligncenter',
			value: 'center',
		},
		right: {
			title: __( 'Align Right', 'giphy-block' ),
			icon: 'editor-alignright',
			value: 'right',
		},
	};

	const defaultLayouts = [ 'left', 'center', 'right' ];

	useEffect( () => {
		if ( ! selectedGif.hasOwnProperty( 'url' ) ) {
			setAttributes( { isEditing: true } );
		}

		const getApiKey = async () => {
			const apiKey = await getGiphyApiKey();
			setGiphyApiKey( apiKey );
		};
		getApiKey();
	}, [] );

	return (
		<>
			<div className={ className }>
				{ isEditing ? (
					<Card className="giphy-block-search">
						<CardBody>
							<TextControl
								label={ __( 'Giphy Block', 'giphy-block' ) }
								placeholder={
									__( 'Search for GIFs here...', 'giphy-block' )
								}
								onChange={ searchGiphy }
							/>
							{ searchActive && ( <Spinner /> ) }
						</CardBody>
					</Card>
				) : false }

				{ ( 0 !== searchResults.length && isEditing ) ? (
					<Card className="giphy-block-search-results">
						{ searchResults.map( ( gif, index ) => {
							return (
								<div key={ index }>
									<Button
										onClick={ () => setSelectedGif( gif ) }
									>
										<img src={ gif.url } alt={ gif.title } />
									</Button>
								</div>
							);
						} ) }
					</Card>
				) : false }

				{ ( selectedGif.hasOwnProperty( 'url' ) && ! isEditing ) ? (
					<div className={ `giphy-block-display-wrapper ${ gifAlign }` }>
						<img src={ selectedGif.url } alt={ selectedGif.title } />
					</div>
				) : false }
			</div>

			<BlockControls>
				<Toolbar>
					<DropdownMenu
						hasArrowIndicator
						icon={ layouts[ gifAlign ].icon }
						label={ __( 'Align GIF', 'giphy-block' ) }
						controls={ defaultLayouts.map( ( layout ) => {
							const isActive = gifAlign === layout;

							return {
								...layouts[ layout ],
								isActive,
								onClick: () => setAttributes( { gifAlign: layout } ),
							};
						} ) }
					/>
					{ isEditing ? (
						<ToolbarButton
							icon="welcome-view-site"
							label={ __( 'Switch to Preview', 'giphy-block' ) }
							onClick={ () => setAttributes( { isEditing: false } ) }
							disabled={ ! selectedGif.hasOwnProperty( 'url' ) }
						/>
					) : (
						<ToolbarButton
							icon="edit"
							label={ __( 'Select another Gif', 'giphy-block' ) }
							onClick={ () => setAttributes( { isEditing: true } ) }
						/>
					) }
				</Toolbar>
			</BlockControls>

			<InspectorControls>
				<Panel>
					<PanelBody
						title={ __( 'Global Settings', 'giphy-block' ) }
						initialOpen={ true }
					>
						<PanelRow>
							<GiphyInputControl
								label={ __( 'Giphy API Key', 'giphy-block' ) }
								type="text"
								value={ giphyApiKey }
								onChange={ ( apiKey ) => setGiphyApiKey( apiKey ) }
								ref={ apiKeyInputRef }
							/>
						</PanelRow>
						<PanelRow>
							<Button
								isPrimary
								onClick={ ( event ) => updateGiphyApiKey( apiKeyInputRef.current.value, event.target ) }
							>
								{ __( 'Save Setting', 'giphy-block' ) }
							</Button>
						</PanelRow>
						<PanelRow>
							<p>
								Get an API key from <a href="https://developers.giphy.com/" target="_blank" rel="noreferrer">Giphy</a> and save it.
							</p>
						</PanelRow>
					</PanelBody>
					<PanelBody
						title={ __( 'Giphy Block Settings', 'giphy-block' ) }
						initialOpen={ true }
					>
						<PanelRow>
							<TextControl
								label={ __( 'Number of GIFs to display', 'giphy-block' ) }
								type="number"
								value={ searchLimit }
								onChange={ ( limit ) => setAttributes( { searchLimit: limit } ) }
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label={ __( 'Rating', 'giphy-block' ) }
								value={ searchRating }
								options={ ratingOptions }
								onChange={ ( rating ) => setAttributes( { searchRating: rating } ) }
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label={ __( 'Language', 'giphy-block' ) }
								value={ searchLang }
								options={ languageOptions }
								onChange={ ( language ) => setAttributes( { searchLang: language } ) }
							/>
						</PanelRow>
					</PanelBody>
				</Panel>
			</InspectorControls>
		</>
	);
}
