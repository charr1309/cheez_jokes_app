import React, { Component } from "react";
import axios from "axios";
import './JokeList.css';
import Joke from './Joke';//allows access to upvote and downvote passed to Joke.js from the render below
import {v4 as uuidv4} from 'uuid';

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10,
  };
  constructor(props) {
    super(props);
    this.state = { 
      jokes: JSON.parse(window.localStorage.getItem('jokes') || "[]"), 
      loading: false
  };
  this.seenJokes = new Set(this.state.jokes.map(j => j.text));
  this.handleClick = this.handleClick.bind(this)
}
  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }
  async getJokes() {
    try{

    let jokes = [];//temporary array
    while (jokes.length < this.props.numJokesToGet) {//set state once after getting 10 jokes--use while to handle duplicate jokes when we request 10 new jokes
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });
      //call uuid as a function so with open and closing parenthesis
      let newJoke = res.data.joke;
      if (!this.seenJokes.has(newJoke)) {
        jokes.push({id: uuidv4(), text: newJoke, votes: 0}); //res.data.joke is the path to a joke from the api--making it an object allows other properties like votes to be added to each joke--using uuid provides an id for each joke so we can access them individualy in the hadleVote function
      }else {
        console.log("FOUND A DUPLICATE!");
        console.log(newJoke);
      }
      
    }
  
    this.setState(st => ({
      loading: false, 
      jokes: [...st.jokes, ...jokes] 
    }),
    () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))); //will add new jokes to jokes array
  } catch(e) {
    alert(e);
    this.setState({loading: false})
  }
   }
    
  
  handleVote(id, delta) {//delta could be a negative number or positive number--id tells which part of the state to update
      this.setState(
          st =>({//implicit return so parenthesis wraps arrow function--st is the variable holding the old state
              jokes: st.jokes.map(j =>
                j.id === id ? {...j, votes: j.votes + delta} : j)//if the joke id is equal to the id that we pass in, take that joke and set its votes property add delta
            }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
           );
  }
  handleClick(){
    this.setState({loading: true},this.getJokes)    
  }
  render() {
    if(this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h1 className='JokeList-title'>Loading...</h1>
        </div>
      )
    }
    let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes);
    return (
      <div className="JokeList">
          <div className='JokeList-sidebar'>
              <h1 className='JokeList-title'>
                  <span>Dad</span> Jokes
              </h1>
              <img
                src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="icon"/>
                <button className='JokeList-getmore' onClick={this.handleClick}>Fetch Jokes</button>
          </div>
      
        <div className="JokeList-jokes">
          {jokes.map((j) => (
            // <div>{j.text} - {j.votes}</div> was mapping to a div
            <Joke 
                key={j.id}//taken from the uuid given to each joke--needed to address key rule in React 
                votes={j.votes} 
                text={j.text} //changed to map from an instance of Joke
                //below we have two methods that we have access too inside the props in the joke
                upvote={()=> this.handleVote(j.id, 1)}
                downvote={()=> this.handleVote(j.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}
export default JokeList;
