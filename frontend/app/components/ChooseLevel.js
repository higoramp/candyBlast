import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import Koji from '@withkoji/vcc';

class ChooseLevel extends Component {
    static propTypes = {
        score: PropTypes.number,
    };

    state = {
        email: '',
        name: '',
        isSubmitting: false,
    };

    levels = Koji.config.levels.levelsMap;

   
 
    componentDidMount() {
      
    }

    handleClose = () => {
        window.setAppView("game");
    }

    selectLevel =(level)=>(e)=>{
      console.log("Select level"+level);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.name != "") {
            this.setState({ isSubmitting: true });

            const body = {
                name: this.state.name,
                score: this.props.score,
                privateAttributes: {
                    email: this.state.email,
                },
            };

            fetch(`${Koji.config.serviceMap.backend}/leaderboard/save`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
                .then((response) => response.json())
                .then((jsonResponse) => {
                    console.log(jsonResponse);

                    window.setAppView('leaderboard');
                })
                .catch(err => {
                    console.log(err);
                });

        }
    }

    render() {
      console.log("RENDER");
      for (let i=0;i<37;i++){
       this.levels.push({'teste': 'teste'});
      }
       localStorage.setItem("lastLevel", 8);


      let nx = Math.floor((width-84)/85);
      let ny = Math.floor((height*0.65)/85);
      let levelPerBoard = nx*ny;
      let nBoards = Math.ceil(this.levels.length/(levelPerBoard));
      let levelsDivided=[];
      for (let i=0;i<nBoards;i++){
        levelsDivided.push(this.levels.slice(i*levelPerBoard, (i+1)*levelPerBoard));
      }
      let lastLevel = localStorage.getItem("lastLevel", 0);

  console.log("BOARDS: "+nBoards);
  console.log(nx+": "+ny);

        return (
            <div   style={{ position: "absolute", backgroundImage: "url("+Koji.config.images.background+")", backgroundSize: "cover", width: "100vw", height: "100vh", textAlign:"center" }} >
                <div className="title"
                    style={{ color: Koji.config.colors.titleColor }}>
                    {"Choose one Level"}
                </div>
                   <form
                        id={'level-form'}
                        onSubmit={this.handleSubmit}
                    >

                  {
                              
                                levelsDivided.map((levelBoard, indexBoard)=>{
                                  return (<div id={'panel-choose-level'+indexBoard} style="padding: 24px"><div  class='panel-choose-level' style={{ backgroundColor: Koji.config.colors.backgroundColor,
                    borderColor: Koji.config.colors.titleColor, display: 'flex' }}>
                                      {
                              
                                levelBoard.map((level, index)=>{
                                  return (indexBoard*levelPerBoard+index)<=lastLevel?
                                   (<div class="panelLevel" onClick={this.selectLevel(indexBoard*levelPerBoard+index)}>
                                    {indexBoard*levelPerBoard+index}
                                  </div>):  (<div class="panelLevel locked">
                                     <img src={Koji.config.images.lock} style="width: 20px; height:20px;"></img>
                                     <span style="position: absolute; margin-top: 20px">{indexBoard*levelPerBoard+index}</span>
                                  </div>);
                                })
                            
                              
                            
                            }
                                  
                              
                                  </div>
                                      {indexBoard>0?
                             (<a class="navigator" href={'#panel-choose-level'+(indexBoard-1)}>	&lt; </a>) :''
                            }
                            {indexBoard<(levelsDivided.length-1)?
                                (<a class="navigator" href={'#panel-choose-level'+(indexBoard+1)}>	&gt;</a>):''
                            }
                                  </div>
                                  )
                                })
                            
                              
                            
                            }
               
                </form>
                <button className="dismiss-button"
                        onClick={this.handleClose}
                        style={{ backgroundColor: Koji.config.colors.buttonColor, color: Koji.config.colors.buttonTextColor }}>
                        {"Cancel"}

                    </button>
            </div>
        )
    }
}

export default ChooseLevel;
