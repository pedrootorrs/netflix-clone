import React, { useEffect, useState } from 'react';
import './App.css';
import tmdb from './tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';
import userEvent from '@testing-library/user-event';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista 
      let list = await tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
      
    }

    loadAll();

  }, [])

useEffect(()=>{
  const scrollListner = () => {
    if(window.scrollY > 20){
      setBlackHeader(true);
    }else{
      setBlackHeader(false);
    }

  }

  window.addEventListener('scroll', scrollListner);

  return () =>{
    window.removeEventListener('scrol', scrollListner);
  }

}, [])



  return (
    <div className="page">

      <Header black={blackHeader} />
 
      {featuredData && 
          <FeaturedMovie item={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site themoviedb.org<br/>
        <a href="https://twitter.com/pedrootorrs" className="profile">twitter🐦</a>
      </footer>

{movieList.length <= 0 &&
      <div className="loading">
        <img src="https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2560%2Cc_limit/Netflix_LoadTime.gif" alt="carregando"></img>
      </div>
}
    </div>
  );
}