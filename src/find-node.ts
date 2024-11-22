import { Node } from 'prosemirror-model'

type FoundNode = {
	node: Node
	pos: number
}

type Args = {
	node: Node
	fieldId: string
}
export const findTemplateFieldNode = ({
	node,
	fieldId,
}: Args): FoundNode | undefined => {
	let foundNode: FoundNode | undefined = undefined

	node.descendants((innerNode, pos) => {
		if (innerNode.attrs.id === fieldId) {
			foundNode = { node: innerNode, pos }
		} else {
			const innerFoundNode = findTemplateFieldNode({
				node: innerNode,
				fieldId,
			})
			if (innerFoundNode) foundNode = innerFoundNode
		}
		if (foundNode) return false
	})

	return foundNode
}
