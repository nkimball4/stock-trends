import "./index.scss"



const AddToWatchlistButton = ({addToWatchlist, addedToWatchlist}) => {
    return (
        <>
            {addedToWatchlist ? (
                <img src={process.env.PUBLIC_URL + `/images/check-mark.svg`} className="check-img"></img>
            ) : (
                <svg
                    fill="#fff"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="800px"
                    height="800px"
                    viewBox="0 0 36.09 36.09"
                    xmlSpace="preserve"
                    className="star-img"
                    onClick={() => {
                        addToWatchlist()
                    }}
                >
                    <g>
                    <path
                        d="M 18,2 L 21.5,11.5 L 31,12.5 L 24,19.5 L 26.5,29 L 18,24.5 L 9.5,29 L 12,19.5 L 5,12.5 L 14.5,11.5 L 18,2 z"
                    />
                    </g>
                </svg>
            )}
        </>
    )
}

export default AddToWatchlistButton;