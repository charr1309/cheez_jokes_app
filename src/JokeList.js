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
    this.state = { jokes: [] };
  }
  async componentDidMount() {
    let jokes = [];//temporary array
    while (jokes.length < this.props.numJokesToGet) {//set state once after getting 10 jokes--use while to handle duplicate jokes when we request 10 new jokes
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      //call uuid as a function so with open and closing parenthesis
      jokes.push({id: uuidv4(), text: res.data.joke, votes: 0}); //res.data.joke is the path to a joke from the api--making it an object allows other properties like votes to be added to each joke--using uuid provides an id for each joke so we can access them individualy in the hadleVote function
    }
    this.setState({ jokes: jokes }); //will overwrite whatever is in the jokes array
  }
  handleVote(id, delta) {//delta could be a negative number or positive number--id tells which part of the state to update
      this.setState(
          st =>({//implicit return so parenthesis wraps arrow function--st is the variable holding the old state
              jokes: st.jokes.map(j =>
                j.id === id ? {...j, votes: j.votes + delta} : j)//if the joke id is equal to the id that we pass in, take that joke and set its votes property to whatever it is plus delta
          
        }))

  }
  render() {
    return (
      <div className="JokeList">
          <div className='JokeList-sidebar'>
              <h1 className='JokeList-title'>
                  <span>Dad</span> Jokes
              </h1>
              <img
                src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                <button className='JokeList-getmore'>New Jokes</button>
          </div>
      
        <div className="JokeList-jokes">
          {this.state.jokes.map((j) => (
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
