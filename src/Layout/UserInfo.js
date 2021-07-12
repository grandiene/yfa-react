import React, {Component, Fragment} from 'react'
import axios from "axios";
import MenuUser from "./MenuUser";
import {CardActionArea, CardMedia, TextField} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {PhotoCamera} from "@material-ui/icons";
import {Button} from "reactstrap";
import Header from "../Components/Header";
import JumbotronKu from "../Components/JumbotronKu";
import bg from "../img/2.jpg";
import ModalKu from "../Components/ModalKu";
import {TableEdit} from "../Components/TableEdit";
import Footer from "../Components/Footer";

class UserInfo extends Component {

    constructor() {
        super();

        let dataForm = {
            firstname: "",
            lastname: "",
            ktp: "",
            email: "",
            alamat: "",
        }

        this.state = {
            dataTable: [],
            column: [],
            modal: false,
            modalEdit: false,
            modalDelete: false,

            //ganti tabel
            tabelTransaksiUser: false,
            tabelUser: true,
            hiddenFoto: "none",

            id: 0,
            dataForm: dataForm,
            imageUplod: ''
        }
        // this.toggle = this.toggle.bind(this)
        this.modalToggleEdit = this.modalToggleEdit.bind(this)
        this.selectDataRow = this.selectDataRow.bind(this)
        this.sendDataEditForm = this.sendDataEditForm.bind(this)
    }

    selectDataRow(data, modal) {
        this.state.dataForm = data
        // this.state.displayImage = "none"
        if (modal === "Edit") {
            // console.log(this.state.dataForm)
            this.modalToggleEdit()
        } else {
            this.toggleDelete()
            console.log("Hapus")
        }
    }
    async getDataUser() {
        const username = localStorage.getItem("username")
        const res = await axios.get(`http://localhost:3333/api/user/${username}`
        )

        const data = res.data
        console.log(data)
        const dataTable = [{
            idUser: data.idUser,
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
            ktp: data.ktp,
            email: data.email,
            username: data.username,
            alamat: data.alamat,
        }]
        console.log(dataTable)
        return dataTable
    }

    componentDidMount() {
        this.getDataUser().then(res => {
            this.setState({dataTable: res})
            this.setState({
                column: [
                    // {title: 'id', field: 'id'},
                    {title: 'Id User', field: 'idUser'},
                    {title: 'First Name', field: 'firstname'},
                    {title: 'Last Name', field: 'lastname'},
                    {title: 'User Name', field: 'username'},
                    {title: 'Alamat', field: 'alamat'},
                    {title: 'Phone', field: 'phone'},
                    {title: 'KTP', field: 'ktp'},
                    {title: 'Email', field: 'email'},
                ]
            })
        })
    }

    //post mapping edit data
    sendDataEditForm = (e) => {
        // const formData = new FormData();
        const json = {
            "idUser": this.state.dataForm.idUser,
            "firstname": this.state.dataForm.firstname,
            "lastname": this.state.dataForm.lastname,
            "username": this.state.dataForm.username,
            "email": this.state.dataForm.email,
            "phone": this.state.dataForm.phone,
            "ktp": this.state.dataForm.ktp,
            "alamat": this.state.dataForm.alamat,
        };

        axios.post("http://localhost:3333/api/user/upload", json)
            .then(res => {
                this.getDataUser().then(response => {
                    this.setState({dataTable: response})
                })
            })
        this.modalToggleEdit(e)
        console.log(this.state.dataTable)
    }

    modalToggleEdit(e) {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    //handleChange input modal form
    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState(prevState => ({
            dataForm: {
                ...prevState.dataForm,
                [name]: value
            }
        }));
    }

    //edit form data kurir
    contentFormEdit() {
        return (
            <Fragment>
                <form>
                    <div style={{paddingTop: '10px', paddingBottom: '25px'}}>
                        <h5>Data User</h5>

                        <TextField style={{width: '100%', fontStyle: 'italic'}} label="First Name"
                                   name="firstaname" value={this.state.dataForm && this.state.dataForm.firstname}/>
                        <TextField style={{width: '100%', fontStyle: 'italic'}} label="Last Name"
                                   name="lastname" value={this.state.dataForm && this.state.dataForm.lastname}/>
                        <TextField style={{width: '100%', fontStyle: 'italic'}} label="User Name"
                                   name="username" value={this.state.dataForm && this.state.dataForm.username}/>
                        <TextField style={{width: '100%', fontStyle: 'italic'}} label="Email"
                                   name="email" value={this.state.dataForm && this.state.dataForm.email}/>
                        <TextField style={{width: '100%'}}  onChange={this.handleChange} label="phone" type="number"
                                   name="phone" value={this.state.dataForm && this.state.dataForm.phone}/>
                        <TextField style={{width: '100%'}}  onChange={this.handleChange} label="Alamat"
                                   name="alamat" value={this.state.dataForm && this.state.dataForm.alamat}/>
                        <TextField style={{width: '100%'}}  onChange={this.handleChange} label="KTP"
                                   name="ktp" inputProps={{maxLength: 16}} value={this.state.dataForm && this.state.dataForm.ktp}/>
                        <div style={{marginTop: '20px'}}>
                        </div>

                        <div align="right" style={{marginTop: "20px"}}>
                            <Button variant="contained" color="primary" style={{marginRight: '5px'}}
                                    onClick={this.sendDataEditForm}>Insert</Button>
                            <Button variant="outlined" color="primary" style={{marginLeft: '5px'}}
                                    onClick={this.modalToggleEdit}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </Fragment>
        )
    }

    //pindah table
    tabelTransaksiUser() {
        this.setState({
            tabelTransaksiUser: true,
            tabelUser: false
        })
        const link = document.createElement("a")
        link.href = "/user/transaksi"
        document.body.appendChild(link)
        link.click()
    }

    tabelUser() {
        this.setState({
            tabelTransaksiUser: false,
            tabelUser: true
        })
        const link = document.createElement("a")
        link.href = "/user/info"
        document.body.appendChild(link)
        link.click()
    }

    render() {
        return (
            <Fragment>
                <Header bgNav={"#1EABFF"}/>
                <JumbotronKu image={bg}
                             jumboAfter={'linear-gradient(to right, rgba(19,54,113,1), rgba(19,54,113,0) 70%)'}
                             title={"User YFA Express"}/>
                <main>
                    <div style={{marginBottom: '70px'}}>

                        {/*button pilih tabel*/}
                        <div className="pilih">
                            <div className="pilih-tabel-transaksi" onClick={this.tabelTransaksiUser.bind(this)}>
                                <div
                                    className={`pilih-tabel-transaksi-desc ${this.state.tabelTransaksiUser ? 'font-biru' : ''}`}>
                                    <div className="title">
                                        Transaksi
                                    </div>
                                    <div className="deskripsi">
                                        Data history user
                                    </div>
                                    <div className={`garis ${this.state.tabelTransaksiUser ? 'bg-biru' : ''}`}></div>
                                </div>
                                <div className="pilih-tabel-transaksi-image-tabel"></div>
                            </div>
                            <div className="pilih-tabel-kurir" onClick={this.tabelUser.bind(this)}>
                                <div className={`pilih-tabel-kurir-desc ${this.state.tabelUser ? 'font-biru' : ''}`}>
                                    <div className="title">
                                        User
                                    </div>
                                    <div className="deskripsi">
                                        Data User YFA
                                    </div>
                                    <div className={`garis ${this.state.tabelUser ? 'bg-biru' : ''}`}></div>
                                </div>
                                <div className="pilih-tabel-kurir-image-tabel"></div>
                            </div>
                        </div>


                        <ModalKu headerColor={'#133671'}
                                 namaModalInsert={"Form User"}
                                 namaModalEdit={"Edit User"}
                                 formData={this.state.dataForm}
                                 isiFormEdit={this.contentFormEdit()}
                                 modalInsert={this.state.modal}
                                 modalEdit={this.state.modalEdit}
                                 modalAlert={this.state.modalDelete}
                                 togglesInsert={this.toggle}
                                 togglesEdit={this.modalToggleEdit}
                                 togglesAlert={this.toggleDelete}
                        />
                        <TableEdit title={"Data User"}
                               color={"rgba(30, 171, 255, 1)"}
                               data={this.state.dataTable}
                               column={this.state.column}
                               search={true}
                               paging={true}
                               filter={false}
                               export={false}
                               actionEdit={this.selectDataRow}
                        />
                    </div>
                </main>
                <Footer/>

            </Fragment>
        )
    }
}

export default UserInfo;
