import React, { Component } from 'react';
import Menu from './MenuComponent';
import DishDetail from './DishDetailComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { postComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      promotions: state.promotions,
      leaders: state.leaders, 
      comments: state.comments
    }  
}

const mapDispatchToProps = (dispatch) => ({
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    fetchDishes: () => {dispatch(fetchDishes())},
    resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos())
      
});
class Main extends Component {

  // constructor(props) {
  //   super(props);    
  // }

  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    //this.props.featured();
  }

  onDishSelect(dishId) {
    this.setState({ selectedDish: dishId});
  }

  render() {
    const HomePage = () => {
     return (
       <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
       dishesLoading={this.props.dishes.isLoading}
       dishErrmess={this.props.dishes.errMess}
       promoLoading={this.props.promotions.isLoading}
       promoErrMess={this.props.promotions.errMess}
       leader={this.props.leaders.filter((leader) => leader.featured)[0]}
       />
     );
    }

    const DishWithId = ({match}) => {
      return (
        <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]} 
        isLoading={this.props.dishes.isLoading}
        errmess={this.props.dishes.errMess}
        comments={this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))} addComment={this.props.addComment} 
        commentsErrMess={this.props.comments.errMess}
        postComment={this.props.postComment}  />
      ); 

    }
    return (
      <div>
        <Header />
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
                  <Route path='/home' component={HomePage} />
                  <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
                  <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />} />
                  <Route path="/menu/:dishId" component={DishWithId} />
                  <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders} />} />
                  
                  <Redirect to="/home" />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
