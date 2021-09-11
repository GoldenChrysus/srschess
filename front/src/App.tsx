import React from 'react';
import './App.css';

import Container from "./components/Container";
import { User } from "./api/models/";

function App() {
	return (
		<Container users={User.store}/>
	);
}

export default App;
