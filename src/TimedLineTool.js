import React from 'react'
import {
	Mat,
	StateNode,
	Vec,
	createShapeId,
	getIndexAbove,
	last,
	maybeSnapToGrid,
	sortByIndex,
	structuredClone
} from '@tldraw/editor'
import { LineShapeTool, LineShapeUtil } from 'tldraw'

let timedLineConfig = {
	lifespanMs: 5000,
	fadeMs: 2000
}

export function setTimedLineConfig(config) {
	timedLineConfig = { ...timedLineConfig, ...config }
}

export function getTimedLineConfig() {
	return timedLineConfig
}

export class TimedLineShapeUtil extends LineShapeUtil {
	static type = 'timed-line'
	static migrations = {
		id: 'com.tldraw.shape.timed-line',
		version: 1,
		sequence: []
	}

	component(shape) {
		const fade = shape?.meta?.fade ?? 1
		const opacity = Math.max(0, Math.min(1, fade))
		const base = super.component(shape)
		return React.cloneElement(base, {
			style: { ...(base?.props?.style || {}), opacity }
		})
	}
}

class TimedLineIdle extends StateNode {
	static id = 'idle'

	shapeId = null

	onEnter(info = {}) {
		this.shapeId = info.shapeId
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}

	onPointerDown() {
		this.parent.transition('pointing', { shapeId: this.shapeId })
	}

	onCancel() {
		this.editor.setCurrentTool('select')
	}
}

class TimedLinePointing extends StateNode {
	static id = 'pointing'

	shape = null
	markId = null

	onEnter(info = {}) {
		const { inputs } = this.editor
		const { currentPagePoint } = inputs

		this.markId = undefined

		const shape = info.shapeId && this.editor.getShape(info.shapeId)

		if (shape && inputs.shiftKey) {
			this.markId = this.editor.markHistoryStoppingPoint(`creating_timed_line:${shape.id}`)
			this.shape = shape

			const handles = this.editor.getShapeHandles(this.shape)
			if (!handles) return

			const vertexHandles = handles.filter(h => h.type === 'vertex').sort(sortByIndex)
			const endHandle = vertexHandles[vertexHandles.length - 1]
			const prevEndHandle = vertexHandles[vertexHandles.length - 2]

			const shapePagePoint = Mat.applyToPoint(
				this.editor.getShapeParentTransform(this.shape),
				new Vec(this.shape.x, this.shape.y)
			)
			const nudgedPoint = Vec.Sub(currentPagePoint, shapePagePoint).addXY(0.1, 0.1)
			const nextPoint = maybeSnapToGrid(nudgedPoint, this.editor)
			const points = structuredClone(this.shape.props.points)

			if (
				Vec.DistMin(endHandle, prevEndHandle, 2) ||
				Vec.DistMin(nextPoint, endHandle, 2)
			) {
				points[endHandle.id] = {
					id: endHandle.id,
					index: endHandle.index,
					x: nextPoint.x,
					y: nextPoint.y
				}
			} else {
				const nextIndex = getIndexAbove(endHandle.index)
				points[nextIndex] = {
					id: nextIndex,
					index: nextIndex,
					x: nextPoint.x,
					y: nextPoint.y
				}
			}

			this.editor.updateShapes([
				{
					id: this.shape.id,
					type: this.shape.type,
					props: {
						points
					}
				}
			])
		} else {
			const id = createShapeId()

			this.markId = this.editor.markHistoryStoppingPoint(`creating_timed_line:${id}`)

			const newPoint = maybeSnapToGrid(currentPagePoint, this.editor)
			const now = Date.now()

			this.editor.createShapes([
				{
					id,
					type: 'timed-line',
					x: newPoint.x,
					y: newPoint.y,
					props: {
						scale: this.editor.user.getIsDynamicResizeMode()
							? 1 / this.editor.getZoomLevel()
							: 1
					},
					meta: {
						timed: true,
						createdAt: now,
						lifespanMs: timedLineConfig.lifespanMs,
						fadeMs: timedLineConfig.fadeMs,
						baseOpacity: this.editor.getStyleForNextShape('opacity') ?? 1,
						fade: this.editor.getStyleForNextShape('opacity') ?? 1
					}
				}
			])

			if (!this.editor.getShape(id)) {
				this.cancel()
				return
			}

			this.editor.select(id)
			this.shape = this.editor.getShape(id)
		}
	}

	onPointerMove() {
		if (!this.shape) return

		if (this.editor.inputs.isDragging) {
			const handles = this.editor.getShapeHandles(this.shape)
			if (!handles) {
				if (this.markId) this.editor.bailToMark(this.markId)
				throw Error('No handles found')
			}
			const lastHandle = last(handles)
			this.editor.setCurrentTool('select.dragging_handle', {
				shape: this.shape,
				isCreating: true,
				creatingMarkId: this.markId,
				handle: { ...lastHandle, x: lastHandle.x - 0.1, y: lastHandle.y - 0.1 },
				onInteractionEnd: 'timed-line'
			})
		}
	}

	onPointerUp() {
		this.complete()
	}

	onCancel() {
		this.cancel()
	}

	onComplete() {
		this.complete()
	}

	onInterrupt() {
		this.parent.transition('idle')
		if (this.markId) this.editor.bailToMark(this.markId)
		this.editor.snaps.clearIndicators()
	}

	complete() {
		this.parent.transition('idle', { shapeId: this.shape?.id })
		this.editor.snaps.clearIndicators()
	}

	cancel() {
		if (this.markId) this.editor.bailToMark(this.markId)
		this.parent.transition('idle', { shapeId: this.shape?.id })
		this.editor.snaps.clearIndicators()
	}
}

export class TimedLineTool extends StateNode {
	static id = 'timed-line'
	static initial = 'idle'
	static children() {
		return [TimedLineIdle, TimedLinePointing]
	}

	shapeType = 'timed-line'
}

TimedLineTool.shortcuts = LineShapeTool.shortcuts
