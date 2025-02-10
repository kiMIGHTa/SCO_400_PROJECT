import React, { useState } from 'react'
import './home.css'
import Header from '../../components/Header/header'
import ExplorePage from '../../components/ExplorePage/explorePage'
import ItemDisplay from '../../components/ItemDisplay/ItemDisplay'
const Home = () => {
  const [category, setCategory] = useState('All')
  return (
    <div className='home-page'>
      <Header />
      <ExplorePage category={category} setCategory={setCategory} />
      <ItemDisplay category={category} />
    </div>
  )
}

export default Home
