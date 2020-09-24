import { forwardRef } from '@wordpress/element';
import { BaseControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

const GiphyInputControl = forwardRef( ( props, ref ) => {
	const instanceId = useInstanceId( GiphyInputControl );
	const id = `gist-input-control-${ instanceId }`;

	return (
		<BaseControl
			label={ props.label }
			id={ id }
		>
			<input
				className="components-text-control__input"
				type="text"
				value={ props.value }
				onChange={ ( event ) => props.onChange( event.target.value ) }
				placeholder={ props.placeholder }
				ref={ ref }
				id={ id }
			/>
		</BaseControl>
	);
} );

export default GiphyInputControl;
