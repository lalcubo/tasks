import React from 'react';
import firebase from '../config/Firebase';
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from './Loading'
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';


class Table extends React.Component{
    state={
        data: [],
        data2: [],
        totalData: [],
        modalInsert: false,
        modalEdit: false,
        id: 0,
        form:{
            Actor: '',
            Actress: '',
            Awards: '',
            Director: '',
            Image: '',
            Length: 0,
            Popularity: 0,
            Subject: '',
            Title: '',
            Year: 0,
        },
        total: 0,
        page: 2,
        limit: 2,
        show: false,
        typeFilter: 'Actor',
        loading: true,
        
    }
    
    getDataFirts=()=>{
        firebase.child("tasks").on("value",(task)=>{
            if(task.val()!=null){
                this.setState({...this.state.totalData, totalData: task.val() })
                this.setState({total: (Object.keys(this.state.totalData).length)})
                this.getData()

            }else{
                this.setState({data:[]})
                this.setState({data2:[]})
            }
        })
    }
    getData=()=>{
        firebase.child("tasks").limitToFirst(parseInt(this.state.limit)).on("value",(task)=>{
            if(task.val()!=null){
                this.setState({...this.state.data, data: task.val() })
                this.setState({...this.state.data2, data2: task.val() })
                this.setState({loading: false})

            }else{
                this.setState({data:[]})
                this.setState({data2:[]})
            }
        })
    }
    getDataFilter=e=>{
        this.setState({data: Object.values(this.state.data2).filter(item => item[this.state.typeFilter].includes(e.target.value))})
    }
    
    getTypeFilter=e=>{
        this.setState({typeFilter: e.target.value},() => this.getData());
    }

    postData=()=>{
        firebase.child('tasks').push(this.state.form,
            error=>{
                if(error)console.log(error)
            });
        this.setState({modalInsert: false});
    }

    putData=()=>{
        firebase.child(`tasks/${this.state.id}`).set(this.state.form,
            error=>{
                if(error)console.log(error)
            });
        this.setState({modalEdit: false});
    }

    deleteData=()=>{
        if(window.confirm('Are you Sure')){
            firebase.child(`tasks/${this.state.id}`).remove(
                error=>{
                    if(error)console.log(error)
                });
                this.setState({modalEdit: false});
        }
    }

    loadMoreData=()=>{
        let actual = this.state.data.length;
        let page = this.state.page;
        document.getElementById("filter").value = "";
        if((actual+page)<=this.state.total){
            this.setState({limit: parseInt(actual+page)},() => this.getData());
        }
        else{
            this.setState({limit: parseInt(this.state.total)},() => this.getData());
        }
    }

    selectTask=async(task,id,type)=>{
        await this.setState({form: task, id: id});

        (type==="Edit")? this.setState({modalEdit: true}):
        this.deleteData();
    }

    handleChange=e=> {
        this.setState({page: parseInt(e.target.value)});
        
    }
    

    handleChangeForm=e=> {
        this.setState({form:{
            ...this.state.form,
            [e.target.name]: e.target.value}});
    }

    componentDidMount(){
        this.getDataFirts();
    }


    render(){
        return (
            <div className="ml-5 mr-5">
                <button className="btn btn-success" onClick={()=>this.setState({modalInsert: true})}>Insert</button>
                <select defaultValue={'DEFAULT'} className="ml-4 form-select" name="page" onChange={this.handleChange}>
                    <option value="DEFAULT" disabled>Select items for page</option>
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
                

                <select defaultValue={'Actor'} className="ml-4 form-select" name="typeFilter" onChange={this.getTypeFilter}>
                    <option value="Actor">Actor</option>
                    <option value="Actress">Actress</option>
                    <option value="Director">Director</option>
                    <option value="Popularity">Popularity</option>
                </select>
                <input type="text" placeholder="Filter Sensitive" className="ml-4" id="filter" name="filter" onChange={this.getDataFilter}></input>
                {this.state.data != null ? 
                <table className="contentTable table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>Actor</th>
                            <th>Actress</th>
                            <th>Awards</th>
                            <th>Director</th>
                            <th>Image</th>
                            <th>Length</th>
                            <th>Popularity</th>
                            <th>Subject</th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.data).map(i=>{
                            return <tr key={i}>
                                <td>{this.state.data[i].Actor}</td>
                                <td>{this.state.data[i].Actress}</td>
                                <td>{this.state.data[i].Awards}</td>
                                <td>{this.state.data[i].Director}</td>
                                <td>{this.state.data[i].Image}</td>
                                <td>{this.state.data[i].Length}</td>
                                <td>{this.state.data[i].Popularity}</td>
                                <td>{this.state.data[i].Subject}</td>
                                <td>{this.state.data[i].Title}</td>
                                <td>{this.state.data[i].Year}</td>
                                <td>
                                    <button className="btn btn-outline-primary btn-sm" onClick={()=>this.selectTask(this.state.data[i],i,'Edit')}>Edit</button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={()=>this.selectTask(this.state.data[i],i,'Delete')}>Delete</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                :<h1>Loading...</h1>
                }
                <button onClick={()=>this.loadMoreData()}>Load more</button>
                {this.state.loading && <Loading />}

                <Modal isOpen={this.state.modalInsert}>
                    <ModalHeader>Insert Register</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                        <label>Actor: </label>
                        <br />
                        <input type="text" className="form-control" name="Actor" onChange={this.handleChangeForm}></input>
                        <label>Actress: </label>
                        <br />
                        <input type="text" className="form-control" name="Actress" onChange={this.handleChangeForm}></input>
                        <label>Awards: </label>
                        <br />
                        <select defaultValue={"No"} className="form-select" name="Awards" onBlur={this.handleChangeForm}>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                        <br />
                        <label>Director: </label>
                        <br />
                        <input type="text" className="form-control" name="Director" onChange={this.handleChangeForm}></input>
                        <br />
                        <label>Image: </label>
                        <br />
                        <input type="text" min="1" className="form-control" name="Image" onChange={this.handleChangeForm}></input>
                        <label>Length: </label>
                        <br />
                        <input type="number" min="1" className="form-control" name="Length" onChange={this.handleChangeForm}></input>
                        <label>Popularity: </label>
                        <br />
                        <input type="number" className="form-control" name="Popularity" onChange={this.handleChangeForm}></input>
                        <label>Subject: </label>
                        <br />
                        <input type="text" className="form-control" name="Subject" onChange={this.handleChangeForm}></input>
                        <label>Title: </label>
                        <br />
                        <input type="text" className="form-control" name="Title" onChange={this.handleChangeForm}></input>
                        <label>Year: </label>
                        <br />
                        <input type="number" min="1990" className="form-control" name="Year" onChange={this.handleChangeForm}></input>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-outline-primary btn-sm" onClick={()=>this.postData()}>Insert</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={()=>this.setState({modalInsert: false})}>Cancel</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalEdit}>
                    <ModalHeader>Edit Register</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                        <label>Actor: </label>
                        <br />
                        <input type="text" className="form-control" name="Actor" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Actor}></input>
                        <label>Actress: </label>
                        <br />
                        <input type="text" className="form-control" name="Actress" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Actress}></input>
                        <label>Awards: </label>
                        <br />
                        <input type="text" className="form-control" name="Awards" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Awards}></input>
                        <label>Director: </label>
                        <br />
                        <input type="text" className="form-control" name="Director" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Director}></input>
                        <label>Image: </label>
                        <br />
                        <input type="text" className="form-control" name="Image" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Image}></input>
                        <label>Length: </label>
                        <br />
                        <input type="number" className="form-control" name="Length" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Length}></input>
                        <label>Popularity: </label>
                        <br />
                        <input type="number" className="form-control" name="Popularity" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Popularity}></input>
                        <label>Subject: </label>
                        <br />
                        <input type="text" className="form-control" name="Subject" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Subject}></input>
                        <label>Title: </label>
                        <br />
                        <input type="text" className="form-control" name="Title" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Title}></input>
                        <label>Year: </label>
                        <br />
                        <input type="number" min="1990" className="form-control" name="Year" onChange={this.handleChangeForm} value={this.state.form && this.state.form.Year}></input>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-outline-primary btn-sm" onClick={()=>this.putData()}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={()=>this.setState({modalEdit: false})}>Cancel</button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Table