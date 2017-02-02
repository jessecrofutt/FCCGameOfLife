var Modal = ReactBootstrap.Modal;// jscs:ignore
var Button = ReactBootstrap.Button;
var Popover = ReactBootstrap.Popover;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var boardArray = [];

class Cell extends React.Component {

    constructor (props) {

        super(props);
        this.state = {
            alive: false,
            backGroundColor: '#000000',
            changed: false
        };
        this.changeState = this.changeState.bind(this);
        this.sendUpLivelynessChange = this.sendUpLivelynessChange.bind(this);
    }

    componentWillMount() {

        let tempArray = this.props.gameArray;
        var bgColor = tempArray[this.props.cellIdx][this.props.cellIdy][0] ? '#00FC05' : 'black';

        this.setState({
            alive: tempArray[this.props.cellIdx][this.props.cellIdy][0],
            backGroundColor: bgColor,
            changed: tempArray[this.props.cellIdx][this.props.cellIdy][1]
        });
    }

    componentWillReceiveProps(){

        let stateChangeFromAnimation = this.props.gameArray;
        let bgColor = stateChangeFromAnimation[this.props.cellIdx][this.props.cellIdy][0] ? '#00FC05' : 'black';
        let age = stateChangeFromAnimation[this.props.cellIdx][this.props.cellIdy][1];
        if(age === -1) bgColor = '#410019';
        if(age === 1) bgColor = '#00FF4D';
        if(age  > 1) bgColor = '#00FF97';

        this.setState({
            alive: stateChangeFromAnimation[this.props.cellIdx][this.props.cellIdy][0],
            backGroundColor: bgColor,
            changed: stateChangeFromAnimation[this.props.cellIdx][this.props.cellIdy][1]
        });
    }

    render() {

        let cellDimensions = (500 / this.props.mainState.columns);
        const cellStyle = {
            backgroundColor: this.state.backGroundColor,
            height: cellDimensions + 'px',
            width: cellDimensions + 'px'

        };
        return (
            <div    style = {cellStyle}
                    className="cell"
                    onClick={this.changeState}
                    onDragLeave={this.changeState}
                    >
            </div>
        );
    }

    changeState() {

        let tempState = this.state;

        if (tempState.alive === true) {
            tempState.alive = false;
            tempState.backGroundColor = 'black';
            tempState.changed = 0;
        } else if (tempState.alive === false) {
            tempState.alive = true;
            tempState.backGroundColor = '#00FC05';
            tempState.changed = 1;
        }

        this.setState({
            alive: tempState.alive,
            backGroundColor: tempState.backGroundColor,
            changed: tempState.changed
        });

        this.sendUpLivelynessChange();
    }

    sendUpLivelynessChange() {

        this.props.sendUpLivelynessChange(  this.props.cellIdx,
            this.props.cellIdy,
            this.state.alive,
            this.state.changed);

    }
}

class Row extends React.Component {

    constructor(props) {

        super(props);
        this.recieveLivelynessChange = this.recieveLivelynessChange.bind(this);
    }

    render() {

        var width = this.props.columns;
        var columns = [];

        for (var x = 0; x < width; x++) {
            this.recieveLivelynessChange();
            columns.push(
                <Cell   cellIdy = {this.props.rowId}
                        cellIdx = {x}
                        key = {'x'+x+'y'+this.props.rowId}
                        className = "cell"
                        sendUpLivelynessChange = {this.props.recieveLivelynessChange}
                        gameArray = {this.props.gameArray}
                        mainState = {this.props.mainState}
                />
            );
        };
        return (
            <div className = "rowHolder">
                {columns}
            </div>
        );
    }

    recieveLivelynessChange(cellIdx, cellIdy, alive, changed) {}
}

class Grid extends React.Component {

    constructor(props) {

        super(props);
        this.recieveLivelynessChange = this.recieveLivelynessChange.bind(this);
    }

    render() {

        var height = this.props.rows;
        var rows = [];

        for (var y = 0; y < height; y++) {
            rows.push(
                <Row    rowId = {y}
                        key = {y}
                        recieveLivelynessChange = {this.props.recieveLivelynessChange}
                        columns = {this.props.columns}
                        mainState = {this.props.mainState}
                        gameArray = {this.props.gameArray}
                />
            );
        };
        return (
            <div className = "gridHolder">
                {rows}
            </div>
        );
    }

    recieveCellData(cellId, alive, changed) {
        console.log("cellId: " + cellId + " alive: " + alive+ " changed: " + changed);

    }

    recieveLivelynessChange(cellIdx, cellIdy, alive, changed) {
        boardArray[cellIdx] = [cellIdy, alive, changed];
        console.log('grid-level ' + cellIdx, boardArray[cellIdx]);
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zoom: 4,
            gameArray: [],
            boardWidth: 20,
            rows: 30,
            columns: 40,
            time: 0,
            framesPerSecond: 5,
            randomize: false,
            generations: 0,
            population: 0,
            populationColor: 'green'
        }

        this.clearBoard = this.clearBoard.bind(this);
        this.randomize = this.randomize.bind(this);
        this.recieveLivelynessChange = this.recieveLivelynessChange.bind(this);
        this.refreshGrid = this.refreshGrid.bind(this);
        this.slowDown = this.slowDown.bind(this);
        this.speedUp = this.speedUp.bind(this);
        this.startAnimation = this.startAnimation.bind(this);
        this.stopAnimation = this.stopAnimation.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
    }

    componentWillMount() {

        this.clearBoard(true);

        if (!this.state.randomize) {

            this.getR_Pentomino(Math.floor(this.state.columns / 2), Math.floor(this.state.rows / 2));
            this.getGlider(Math.floor(this.state.columns / 3), Math.floor(this.state.rows / 3));
            this.getBlinker(Math.floor(this.state.columns / 4), Math.floor(this.state.rows / 4));
            this.getToad(Math.floor(this.state.columns / 1.5), Math.floor(this.state.rows / 1.5));
            this.setState({
                gameArray:boardArray
            });
        }
    }

    render() {
        const popColor = {
            color: this.state.populationColor
        };
        return (
            <div id="page" className = "container">
                <h1>Game of Life</h1>
                <div className="gridArea">
                    <Grid   className="grid"
                            rows = {this.state.rows}
                            columns = {this.state.columns}
                            gameArray = {this.state.gameArray}
                            recieveLivelynessChange = {this.recieveLivelynessChange}
                            mainState = {this.state}
                    />
                </div>
                <div id = "bottomMatter">
                    <div id="buttons">
                        <div id = "buttonControlArea">
                            <Button active bsStyle = "primary" className = "fa fa-play" id="buttonStart" onClick={this.startAnimation}></Button>
                            <Button active bsStyle = "primary" className = "fa fa-stop " id="buttonStop" onClick={this.stopAnimation}></Button>
                            <Button active bsStyle = "primary" className = "fa fa-trash" id="buttonClear" onClick={() => this.clearBoard(false, null, null)}></Button>
                        </div>
                        <div id = "buttonViewArea">
                            <div id = "buttonViewZoomArea">
                                <Button active bsStyle = "primary" className = "fa fa-search-plus " id="zoomIn" onClick={this.zoomIn}></Button>
                                    {this.state.columns + ' X ' + this.state.rows}
                                <Button active bsStyle = "primary" className = "fa fa-search-minus " id="zoomOut" onClick={this.zoomOut}></Button>
                            </div>
                            <div id = "buttonViewSpeedArea">
                                <Button active bsStyle = "primary" className = "fa fa-fast-backward " id="zoomIn" onClick={this.slowDown}></Button>
                                {this.state.framesPerSecond + ' fps'}
                                <Button active bsStyle = "primary" className = "fa fa-fast-forward " id="zoomOut" onClick={this.speedUp}></Button>
                            </div>
                        </div>
                        <div id = "buttonMiscArea">
                            <Button active bsStyle = "primary" className = "" id="buttonRandomize" onClick={this.randomize}>Randomize</Button>
                        </div>
                    </div>
                    <div id = "feedback">
                        <div className = "">
                            {'Generations: ' + this.state.generations}
                        </div>
                        <div className = "">
                            {'Population: ' }
                            <span  style = {popColor}>
                                {this.state.population}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        );
        let randomize = true;
    }

    clearBoard(randomize, tempRows, tempColumns) {
        let randomania = randomize || false;
        let rows = tempRows || this.state.rows;
        let columns = tempColumns || this.state.columns;
        boardArray = [];
        let cleanBoardArray = [];
        let population = 0;

        for (var i = 0; i < columns; i++) {
            cleanBoardArray.push([]);
            for (var j = 0; j < rows; j++) {
                if(randomania === true) {
                    let randomState = Math.round(Math.random()) ? true : false;
                    if (randomState === true) population++;
                    let cellHistory = 0;
                        //second array position corresponds to recentlyChanged but that will always be the same
                        //as randomState when creating a new random array
                    cleanBoardArray[i].push([randomState, cellHistory]);
                } else {
                    cleanBoardArray[i].push([false, 0]);
                }
            }
        }
        boardArray = cleanBoardArray;
        this.setState({
            gameArray: cleanBoardArray,
            randomize: false,
            generations: 0,
            population: population,
            populationColor: 'green'
        });
        this.forceUpdate();
    }

    determineLivelyness(oldBoard, x, y, livelyness){

        let neighbors = 0;
        const board = oldBoard;

        let xM = (x === 0) ?  this.state.columns - 1  : x - 1;
        let yM = (y === 0) ?  this.state.rows - 1 : y - 1;
        let xP = (x === this.state.columns - 1) ? 0 : x + 1;
        let yP = (y === this.state.rows - 1) ? 0 : y + 1;

        if (board[xM][yM][0] === true) neighbors++;
        if (board[x][yM][0] === true) neighbors++;
        if (board[xP][yM][0] === true) neighbors++;
        if (board[xM][y][0] === true) neighbors++;
        if (board[xP][y][0] === true) neighbors++;
        if (board[xM][yP][0] === true) neighbors++;
        if (board[x][yP][0] === true) neighbors++;
        if (board[xP][yP][0] === true) neighbors++;

        let toReturn;

        if (livelyness === true) {
            let belively = false;
            if (1 < neighbors && neighbors < 4) {
                belively = true;
            }
            toReturn = belively;
        }
        if(livelyness === false) {
            let belively = false;
            if (neighbors === 3) {
                belively = true;
            }
            toReturn = belively;
        };
        return toReturn;
    }

    determineLongevity(livelyness, longevity){

        let currentAge = longevity;
        if (livelyness === true) {
            currentAge++;
        } else {
            if (longevity > 0) {
                currentAge = -1;
            } else {
                currentAge = 0;
            }
        }
        return currentAge;
    }

    getR_Pentomino(x,y){

        let xP = (x === this.state.columns - 1) ? 0 : x + 1;
        let yP = (y === this.state.rows - 1) ? 0 : y + 1;

        boardArray[x + 1][y][0] =  true;
        boardArray[x + 2][y][0] = true;
        boardArray[x][y + 1][0] = true;
        boardArray[x + 1][y + 1][0] = true;
        boardArray[x + 1][y + 2][0] = true;
    }
    getGlider(x,y){

        let xP = (x === this.state.columns - 1) ? 0 : x + 1;
        let yP = (y === this.state.rows - 1) ? 0 : y + 1;

        boardArray[x][y][0] = true;
        boardArray[x + 2][y][0] = true;
        boardArray[x + 1][y + 1][0] = true;
        boardArray[x + 2][y + 1][0] = true;
        boardArray[x + 1][y + 2][0] = true;
    }
    getBlinker(x,y){

        let xP = (x === this.state.columns - 1) ? 0 : x + 1;
        let yP = (y === this.state.rows - 1) ? 0 : y + 1;

        boardArray[x][y][0] = true;
        boardArray[x + 1][y][0] = true;
        boardArray[x + 2][y][0] = true;
    }
    getToad(x,y){

        let xP = (x === this.state.columns - 1) ? 0 : x + 1;
        let yP = (y === this.state.rows - 1) ? 0 : y + 1;

        boardArray[x + 1][y][0] = true;
        boardArray[x + 2][y][0] = true;
        boardArray[x + 3][y][0] = true;
        boardArray[x][y + 1][0] = true;
        boardArray[x + 1][y + 1][0] = true;
        boardArray[x + 2][y + 1][0] = true;
    }

    randomize() {
        console.log('randomizing');
        this.stopAnimation();
        let randomBoard = true;
        this.clearBoard(randomBoard);
    }

    recieveLivelynessChange(cellIdx, cellIdy, alive, changed) {

        boardArray = this.state.gameArray;
        boardArray[cellIdx][cellIdy] = [alive, changed];

        this.setState({
            gameArray: boardArray
        });
    }

    refreshGrid() {

        this.time = new Date().getTime();
        let oldBoard = [];
        oldBoard = this.state.gameArray.slice(0);
        let newBoard = [];
        let history = 0;
        let population = 0;

        for (let y = 0 ; y < this.state.columns ; y ++ ) {
            newBoard.push([]);
            for (let x = 0 ; x < this.state.rows ; x ++ ) {
                newBoard[y].push([false, 0]);
            }
        }

        for (let y = 0 ; y < this.state.rows ; y ++ ) {
            for (let x = 0 ; x < this.state.columns ; x ++ ) {
                newBoard[x][y][0] = this.determineLivelyness(oldBoard, x, y, oldBoard[x][y][0]);
                newBoard[x][y][1] = this.determineLongevity(oldBoard[x][y][0], oldBoard[x][y][1]);
                if (newBoard[x][y][0] === true) population++;
            }
        }

        let previousPopulation = this.state.population;
        let changeInPopulation =  (previousPopulation > population) ? 'red' : 'green';

        this.setState({
            gameArray: newBoard,
            generations: this.state.generations + 1,
            population: population,
            populationColor: changeInPopulation
        });

        console.log('newBoard');
        var currentTime = new Date().getTime();
        var timeElapsed = currentTime - this.time;
        while (timeElapsed < 1000 / this.state.framesPerSecond) {
            currentTime = new Date().getTime();
            timeElapsed = currentTime - this.time;
        }
        this.intervalID = requestAnimationFrame(this.refreshGrid);
    }

    slowDown() {

        var tempSpeed = this.state.framesPerSecond - 1;
        this.setState({
            framesPerSecond: tempSpeed
        });
        console.log('framerate: ' + this.state.framesPerSecond);
    }

    speedUp() {

        var tempSpeed = this.state.framesPerSecond + 1;
        this.setState({
            framesPerSecond: tempSpeed
        });
        console.log('framerate: ' + this.state.framesPerSecond);
    }

    startAnimation(){
        console.log('startedA');
        requestAnimationFrame(this.refreshGrid);
    }

    stopAnimation(){
        console.log('stoppedA');
        cancelAnimationFrame(this.intervalID);
    }

    zoomIn() {

        this.stopAnimation();
        let tempRows = this.state.rows - 3;
        let tempColumns = this.state.columns - 4;
        this.setState({
            rows: tempRows,
            columns: tempColumns
        }, this.clearBoard(true));
    }

    zoomOut() {

        this.stopAnimation();
        let tempRows = this.state.rows + 3;
        let tempColumns = this.state.columns + 4;
        this.setState({
            rows: tempRows,
            columns: tempColumns
        }, this.clearBoard(true,tempRows,tempColumns));
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('container')
);