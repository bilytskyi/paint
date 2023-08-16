const ActionsHandler = (figures, actions, figureId, selectedFigure, type) => {
    if (actions.current === actions.data.length - 1) {
        if (type === "dragging") {
            const action = [selectedFigure.id, figures[selectedFigure.id].version]
            actions.current = actions.current + 1
            actions.data.push(action)
            selectedFigure.id = null
        } else {
            const action = [figureId, figures[figureId].version]
            actions.current = actions.current + 1
            actions.data.push(action)
        }
    } else {
        const data = []
        for (let i = 0; i <= actions.current; i++) {
            data.push(actions.data[i])
        }
        if (type === "dragging") {
            const action = [selectedFigure.id, figures[selectedFigure.id].version]
            actions.current = actions.current + 1
            data.push(action)
            actions.data = data
            selectedFigure.id = null
        } else {
            const action = [figureId, figures[figureId].version]
            actions.current = actions.current + 1
            data.push(action)
            actions.data = data
        }
    }
}

export default ActionsHandler