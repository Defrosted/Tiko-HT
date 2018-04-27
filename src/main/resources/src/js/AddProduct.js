import React, { Component } from "react";
import { Button, Dropdown, MenuItem, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./AddProduct.css";

export default class AddProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sellingPrice: 0,
            purchasePrice: 0,
            name: "",
            author: "",
            isbn: "",
            published: "",
            genre: "",
            type: "",
            weight: 0,
            antiquaries: [],
            antiquary: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
        return this.state.name.length > 0
            && this.state.author.length > 0
            && this.state.weight > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit(event) {
            event.preventDefault();
            fetch("/management/product/add", {
                method: 'POST',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                body: JSON.stringify({
                    "status": "FREE",
                    "sellingPrice": this.state.sellingPrice,
                    "purchasePrice": this.state.purchasePrice,
                    "work": {
                        "name": this.state.name,
                        "author": this.state.author,
                        "isbn": this.state.isbn,
                        "published": this.state.published,
                        "genre": this.state.genre,
                        "type": this.state.type,
                        "weight": this.state.weight
                    },
                    "antiquary": this.state.antiquary

                }),
                credentials: "same-origin"
            })
                .then(result => {
                    return result.json();
                })
                .then(json => {
                    if(json.success) {
                        this.props.setUser(true, json.data);
                        this.props.toggleModal();
                    } else {
                        this.setState({
                            showAlert: true
                        });
                        setTimeout(() => {
                            this.setState({
                                showAlert: false
                            });
                        }, 5000)
                    }
                });
        }

    componentDidMount() {
        fetch('/data/antiquaries')
            .then(results => {
                console.log({results: results});
                return results.json();
            }).then(data => {
                let antiquaries = data.data;
                console.log(antiquaries);
                this.setState({antiquaries: antiquaries});
            }
        )
    }

    render() {
        let antiquaries = this.state.antiquaries;

        return (
            <div className="container">
                <h2>Uuden teoksen lisääminen</h2>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="sellingPrice" bsSize="large">
                        <ControlLabel>Myyntihinta*</ControlLabel>
                        <FormControl
                            autoFocus
                            type="number"
                            value={this.state.sellingPrice}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="purchasePrice" bsSize="large">
                        <ControlLabel>Ostohinta*</ControlLabel>
                        <FormControl
                            autoFocus
                            type="number"
                            value={this.state.purchasePrice}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="name" bsSize="large">
                        <ControlLabel>Nimi*</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="author" bsSize="large">
                        <ControlLabel>Tekijä*</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.author}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="isbn" bsSize="large">
                        <ControlLabel>ISBN</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.isbn}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="published" bsSize="large">
                        <ControlLabel>Julkaisuvuosi (VVVV)</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.published}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="genre" bsSize="large">
                        <ControlLabel>Genre</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.genre}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="type" bsSize="large">
                        <ControlLabel>Tyyppi</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.type}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="weight" bsSize="large">
                        <ControlLabel>Paino* (kg)</ControlLabel>
                        <FormControl
                            value={this.state.weight}
                            onChange={this.handleChange}
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Antikvariaatti*</ControlLabel>
                        <Dropdown id="dropdown">
                            <Dropdown.Toggle glyph="choose">
                                Valitse..
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    antiquaries.map((result, i) => {
                                        return(
                                            <MenuItem key={i} value={result.id}>{result.name}</MenuItem>
                                        )
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </FormGroup>
                    <p>*:llä merkityt kohdat ovat pakollisia</p>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Lisää teos
                    </Button>
                </form>
            </div>
        );
    }
}