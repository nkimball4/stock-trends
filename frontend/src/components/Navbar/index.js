import { useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.scss';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Search for:", searchQuery);
        navigate(`/chatter/search?company=${searchQuery}`);
    };

    return (
        <div className="navbar">
            <Link className='logo' to='/chatter'>
                <div>chatter</div>
            </Link>
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="search for a company.."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </form>
        </div>
    );
};

export default Navbar;
