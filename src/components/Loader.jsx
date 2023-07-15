const Loader = (props) => {
    
    const isLoading  = props.isLoading;
    let appendHtml = null;

    isLoading ?
        appendHtml = (
            <div className="overlay">
                <div className="loader"></div>
            </div>
        )
        :
        appendHtml =(<></>)
    return appendHtml;
    
};

export default Loader;