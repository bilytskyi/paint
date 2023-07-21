

const ClearButton = ({clear}) => {

    return (
        <button onClick={() => {clear()}}>
            clear
        </button>
    )
}

export default ClearButton