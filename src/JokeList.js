import React, { Component } from "react";
import axios from "axios";
import './JokeList.css';
import Joke from './Joke';
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
    let jokes = [];
    while (jokes.length < this.props.numJokesToGet) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      jokes.push({id: uuidv4(), text: res.data.joke, votes: 0}); //res.data.joke is the path to a joke from the api
    }
    this.setState({ jokes: jokes }); //will overwrite whatever is in the jokes array
  }
  handleVote(id, delta) {
      this.setState(
          st =>({//implicit return so parenthesis wraps arrow function
              jokes: st.jokes.map(j =>
                j.id === id ? {...j, votes: j.votes + delta} : j)
          
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
                key={j.id} 
                votes={j.votes} 
                text={j.text} //changed to map from an instance of Joke
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
