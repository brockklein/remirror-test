import { useRef, useState } from 'react'
import { ReproExtension, ReproExtensionEditor } from './remirror-editor'
import { ReactExtensions, ReactFrameworkOutput } from '@remirror/react'
import './style/index.css'
import { findTemplateFieldNode } from './find-node'

const App = () => {
	const [contentId, setContentId] = useState('initial-id')

	const remirrorRef =
		useRef<ReactFrameworkOutput<ReactExtensions<ReproExtension>>>(null)

	const onChangeId = () => {
		if (!remirrorRef.current) throw new Error('Remirror ref unset')
		const remirrorState = remirrorRef.current.getState()
		const templateFieldNode = findTemplateFieldNode({
			node: remirrorState.doc,
			fieldId: 'initial-id',
		})

		if (!templateFieldNode) throw new Error('Cannot find node in the document')

		const { pos } = templateFieldNode

		const customDispatch = remirrorRef.current.commands.customDispatch

		customDispatch(({ tr, dispatch }) => {
			tr.setNodeAttribute(pos, 'id', 'new-id')

			if (dispatch) {
				console.log('dispatched the transaction', tr)
				dispatch(tr)
			}

			return true
		})

		setContentId('new-id')
	}

	return (
		<div style={{ display: 'flex' }}>
			<div>
				<ReproExtensionEditor ref={remirrorRef} />

				<div className='id-display'>Current ID: {contentId}</div>

				<button onClick={onChangeId} className='update-button'>
					Update to new ID
				</button>
			</div>

			<div style={{ flex: 1, marginLeft: 20 }}>
				<pre>
					{JSON.stringify(remirrorRef.current?.getState().toJSON(), null, 2)}
				</pre>
			</div>
		</div>
	)
}

export default App
