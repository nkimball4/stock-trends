import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLoggedIn } from '../../contexts/loggedInContext';
import './index.scss';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollingUp, setScrollingUp] = useState(true);
    const [scrolledDown, setScrolledDown] = useState(false);
    const {loggedIn, setLoggedIn} = useLoggedIn();
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Search for:", searchQuery);
        navigate(`/chatter/search?company=${searchQuery}`);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.scrollY;
            setScrollingUp(currentPosition === 0);
            setScrolledDown(currentPosition !== 0)
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`navbar ${scrolledDown ? 'scrolled-down' : ''}`}>
            <Link className='logo' to='/chatter'>
                <div>chatter</div>
            </Link>
            <div className='nav-container-right'>
                {loggedIn.loggedInStatus === true ? (
                    <div className='nav-button-wrapper'>
                        <Link className='nav-button' to='/chatter/my-watchlist'>
                            <div>my watchlist</div>
                        </Link>
                        <Link className='nav-button' to='/chatter/about'>
                            <div>about</div>
                        </Link>
                    </div>
                ) : (
                    <div className='nav-button-wrapper'>
                        <Link className='nav-button' to='/chatter/login'>
                            <div>login</div>
                        </Link>
                        <Link className='nav-button' to='/chatter/about'>
                            <div>about</div>
                        </Link>
                    </div>
                )}
                <form className={`search-form ${scrolledDown ? 'scrolled-down' : ''}`} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="search for a company.."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </form>
            </div>
        </div>
    );
};

export default Navbar;
