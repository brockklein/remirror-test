import {
	DOMCompatibleAttributes,
	ExtensionTag,
	NodeExtension,
	NodeExtensionSpec,
} from '@remirror/core'
import {
	EditorComponent,
	NodeViewComponentProps,
	ReactExtensions,
	ReactFrameworkOutput,
	Remirror,
	useRemirror,
} from '@remirror/react'
import { ComponentType, forwardRef, useImperativeHandle } from 'react'

const ReproExtensionInitialContent = `<p><span data-field-id="initial-id"></span><span data-field-id="initial-id"></span></p><p><span data-field-id="initial-id"></span><span data-field-id="initial-id"></span></p>`

	export class ReproExtension extends NodeExtension {
	get name() {
		return 'repro-extension' as const
	}

	ReactComponent: ComponentType<NodeViewComponentProps> = ({ node }) => {
		const { id } = node.attrs

		return <div className='repro-extension-markup'>{id}</div>
	}

	createTags() {
		return [ExtensionTag.InlineNode]
	}
	createNodeSpec(): NodeExtensionSpec {
		return {
			attrs: { id: { default: null } },
			inline: true,
			draggable: true,
			group: 'inline',
			toDOM: node => {
				const attrs: DOMCompatibleAttributes = {
					'data-field-id': node.attrs.id,
				}
				return ['span', attrs]
			},
			parseDOM: [
				{
					attrs: { id: { default: null } },
					tag: 'span[data-field-id]',
					getAttrs: dom => {
						const node = dom as HTMLAnchorElement
						const id = node.getAttribute('data-field-id')

						return { id }
					},
				},
			],
		}
	}
}

const extensions = () => [new ReproExtension({ disableExtraAttributes: true })]

export const ReproExtensionEditor = forwardRef<
	ReactFrameworkOutput<ReactExtensions<ReproExtension>>
>((_, ref) => {
	const { manager, state, getContext } = useRemirror({
		extensions,
		content: ReproExtensionInitialContent,
		stringHandler: 'html',
	})

	// From Remirror docs: https://www.remirror.io/docs/advanced/updating-editor-externally
	useImperativeHandle(ref, () => getContext()!, [getContext])

	return (
		<div className='editor'>
			<Remirror manager={manager} initialContent={state} autoFocus>
				<EditorComponent />
			</Remirror>
		</div>
	)
})
