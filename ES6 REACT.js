/**
 * Created by Hairy on 11/11/2016.
 */
// Defineing the class The ES6+ way
class Photo extends React.Component {
    handleDoubleTap(e) { … }
    render() { … }
}


// Constructor The ES6+ way
class EmbedModal extends React.Component {
    constructor(props) {
        super(props);
        // Operations usually carried out in componentWillMount go here
    }
}

// Property Initializers The ES6+ way
class Video extends React.Component {
    static defaultProps = {
        autoPlay: false,
        maxLoops: 10,
    }
    static propTypes = {
        autoPlay: React.PropTypes.bool.isRequired,
        maxLoops: React.PropTypes.number.isRequired,
        posterFrameSrc: React.PropTypes.string.isRequired,
        videoSrc: React.PropTypes.string.isRequired,
    }
    state = {
        loopsRemaining: this.props.maxLoops,
    }
}

//Luckily, by combining two ES6+ features – arrow functions and property initializers – opt-in binding to the component instance becomes a breeze:

    class PostInfo extends React.Component {
            //arrow function binds this. to PostInfo Component
            //in absense of React.createClass
        handleOptionsButtonClick = (e) => {
            this.setState({showOptionsModal: true});
        }
    }

//The body of ES6 arrow functions share the same lexical this as
//the code that surrounds them, which gets us the desired result
//because of the way that ES7 property initializers are scoped.
//    Peek under the hood to see why this works.

//Dynamic Property names & template strings

//`${inputName}Value` makes use of a template string: `template string` note the marks
//
class Form extends React.Component {
    onChange(inputName, e) {
        this.setState({
            [`${inputName}Value`]: e.target.value,
        });
    }
}

//Destructuring
// list matching
var [a, ,b] = [1,2,3];
a === 1;
b === 3;

// object matching
var { op: a, lhs: { op: b }, rhs: c }
    = getASTNode()

// object matching shorthand
// binds `op`, `lhs` and `rhs` in scope
var {op, lhs, rhs} = getASTNode()

// Can be used in parameter position
function g({name: x}) {
    console.log(x);
}
g({name: 5})

// Fail-soft destructuring
var [a] = [];
a === undefined;

// Fail-soft destructuring with defaults
var [a = 1] = [];
a === 1;

// Destructuring + defaults arguments
function r({x, y, w = 10, h = 10}) {
    return x + y + w + h;
}
r({x:1, y:2}) === 23


//Default + Rest + Spread

function f(x, y=12) {
    // y is 12 if not passed (or passed as undefined)
    return x + y;
}
f(3) == 15
function f(x, ...y) {
    // y is an Array
    return x * y.length;
}
f(3, "hello", true) == 6
function f(x, y, z) {
    return x + y + z;
}
// Pass each elem of array as argument
f(...[1,2,3]) == 6

//Let + Const
//Block-scoped binding constructs. let is the new var. const \
//is single-assignment. Static restrictions prevent use before assignment.
function f() {
    {
        let x;
        {
            // this is ok since it's a block scoped name
            const x = "sneaky";
            // error, was just defined with `const` above
            x = "foo";
        }
        // this is ok since it was declared with `let`
        x = "bar";
        // error, already declared above in this block
        let x = "inner";
    }
}

//Iterators + For..Of
//Iterator objects enable custom iteration like CLR
//IEnumerable or Java Iterable. Generalize for..in to custom
//iterator-based iteration with for..of. Don’t require
//realizing an array, enabling lazy design patterns like LINQ.

    let fibonacci = {
    [Symbol.iterator]() {
        let pre = 0, cur = 1;
        return {
            next() {
                [pre, cur] = [cur, pre + cur];
                return { done: false, value: cur }
            }
        }
    }
}

for (var n of fibonacci) {
    // truncate the sequence at 1000
    if (n > 1000)
        break;
    console.log(n);
}
//Iteration is based on these duck-typed interfaces
//(using TypeScript type syntax for exposition only):

//interface IteratorResult {
//    done: boolean;
//    value: any;
//}
//interface Iterator {
//    next(): IteratorResult;
//}
//interface Iterable {
//    [Symbol.iterator](): Iterator
//}












