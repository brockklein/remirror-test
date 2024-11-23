import { Node } from 'prosemirror-model'

type FoundNode = {
	node: Node
	pos: number
}

type Args = {
	node: Node
	fieldId: string
	pos?: number
}
export const findTemplateFieldNode = ({
	node,
	fieldId,
	pos = 0
}: Args): FoundNode | undefined => {

	for (let i = 0; i < node.childCount; i++) {
		const child = node.child(i)
		if (child.type.name === 'repro-extension' && child.attrs.id === fieldId) {
			return { node: child, pos }
		} else {
			const foundNode = findTemplateFieldNode({ node: child, fieldId, pos: pos + 1 })
			if (foundNode) {
				return foundNode
			}
		}
		pos += child.nodeSize
	}
}
