const ClearComponent = ({clear, size, title}) => {
    let fillColor = "grey"
    return (
        <svg onClick={() => {clear()}} width={size} height={size} viewBox="0 0 24 24" fill={fillColor}><title>{title}</title><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
    )
}

export default ClearComponent