import React, {Component} from 'react';
import './joke.css';
//Joke component is stateless, just calls on these icons an event 
//handler that is passed down from the parent
class Joke extends Component {
    render() {
        return (//used font awesome below to create icons for up and down arrows
            <div className='Joke'>
                <div className='Joke-buttons'> 
                    <i className='fas fa-arrow-up' onClick={this.props.upvote} />
                    <span className='Joke-votes'>{this.props.votes}</span>
                    <i className='fas fa-arrow-down' onClick={this.props.downvote} />
                </div>
                <div className='Joke-text'>{this.props.text}</div>
                <div className = 'Joke-smiley'>
                <i class="em em-rolling_on_the_floor_laughing" aria-role="presentation" aria-label="ROLLING ON THE FLOOR LAUGHING"></i>
                </div>


            </div>
        )
    }
}

export default Joke;