import React, {Component, Fragment} from 'react';
import {Container} from "bootstrap-4-react/lib/components/layout";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faFilePdf, faFileExcel} from "@fortawesome/free-solid-svg-icons";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import JumbotronKu from "../Components/JumbotronKu";
import Loading from "../Components/Loading";
import bg from "../img/2.jpg";
import bgLacak from "../img/lacak.jpg"
import '../Style/Lacak.css';
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";
import axios from "axios";
import AlertKu from "../Components/AlertKu";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField, withStyles} from "@material-ui/core";

const types = ['lacak', 'tarif']
const Button = styled.div`
    width: 100px;
    height: 25px;
    font-size: 11px;
    text-align: center;
    line-height: 25px;
    color: #333;
    cursor: pointer;
    @media (min-width: 450px) {
        width: 150px;
        height: 37px;
        line-height: 37px;
        font-size: 14px;
    }
`
const ButtonToggle = styled(Button)`
    background-color: #ececec;
    color: #333;
    ${({active}) =>
    active && `
    background-color: rgba(30, 171, 255, 1);
    color: #fff;
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
`;

var displayLacak = {display: 'block'}
var displayTarif = {display: 'none'}

 // const getDataResi = (resi) => {
//     fetch(`http://localhost:3333/api/transaksi/resi/${resi}`, {
//         mode: 'no-cors',
//         method: 'get',
//         headers: {
//             "Content-Type": "application/json"
//         },
//     })
//         .then(res => {
//             if(res.ok) {
//                 return res.json()
//                 console.log(res.json())
//             }
//             throw res;
//         })
//         .then(data => {
//             this.setState({data})
//         })
//         .catch(error => {
//             console.error("error fetching data : ", error);
//         })
//         .finally()
// }

class Lacak extends Component {
    constructor() {
        super();
        this.handleClickNavigasi = this.handleClickNavigasi.bind(this)
        this.handleChangeInput = this.handleChangeInput.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDeleteResi = this.handleDeleteResi.bind(this)
        this.getDataResi = this.getDataResi.bind(this)
        this.getReport = this.getReport.bind(this)
        this.getTarif = this.getTarif.bind(this)
        this.state = {
            active : types[0],
            loading : false,
            display: 'block',
            displayTable: 'none',
            displayTableTarif: 'none',
            displayLoading : 'none',
            isAlert : false,
            alertMessage: "",
            data: [],
            dataForm: [],
            dataTransaksi: [],
            dataTarif : [],
        }
    }

    handleClickNavigasi(type) {
        this.setState({
            active: type
        })
        if (type === types[0]) {
            displayLacak = {display: 'block'}
            displayTarif = {display: 'none'}
        } else {
            displayLacak = {display: 'none'}
            displayTarif = {display: 'block'}
        }
    }

    handleChangeInput(event) {
        this.setState({[event.target.name] : event.target.value})
    }

    handleDeleteResi() {
        this.setState({
            resi : '',
            display: 'block',
            displayTable: 'none'
        })
    }

    getDataResi = async (resi) => {
        this.setState({
            displayLoading: 'block',
            isAlert : false
        })

        //java
        await axios.get(`http://localhost:3333/api/transaksi/resi/${resi}`)
        //go
       // await axios.get(`http://localhost:2222/transaksi/resi/${resi}`)
            .then(res => {
                this.setState({
                    //java
                     data: res.data,
                    //go
                    //data: res.data.data,
                    display: 'none',
                    displayTable: 'block',
                    displayLoading: "none"
                })
                // console.log(this.state.data)
            })
            .catch(error => {
                this.setState({
                    displayLoading: "none",
                    alertMessage: "Resi tidak ditemukan",
                    isAlert : true
                })
            }
        )
    }

    async getReport(extensi) {
        this.setState({
            displayLoading: 'block'
        })
        axios({
            url : `http://localhost:3333/report/${this.state.data.resi}.${extensi}`,
            method : 'GET',
            responseType : 'blob'
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute('download', `${this.state.data.resi}.${extensi}`)
            document.body.appendChild(link)
            link.click()
            this.setState({
                displayLoading : 'none'
            })
        })
    }

    async getCity() {
        const city = await axios.get("http://localhost:3333/api/kotaRaja", {
            headers : {'Content-Type' : 'application/json'}
        })
        const dataCity = city.data.map(res => ({
            "value" : res.city_id,
            "label": res.type + " " + res.city_name + ", " + res.province
        }))
        this.setState({selectOptionCity : dataCity})
    }

    getTarif = (id, idPenerima, berat) => {
        this.setState({
            displayLoading: 'block',
            isAlert : false
        })
        axios.get("http://localhost:3333/api/cost/" + id + "/" + idPenerima + "/" + berat)
            .then(res => {
                const dataCost = res.data.map(cost => ({
                    "ongkir" : cost.cost[0].value,
                    "layanan" : cost.service,
                    "estimasi" : cost.cost[0].etd,
                    "berat" : berat
                }))
                this.setState({
                    dataTarif : dataCost,
                    displayTableTarif : 'block',
                    displayLoading : 'none',
                    isAlert: false
                })
            })
            .catch(error => {
                this.setState({
                    displayLoading: "none",
                    alertMessage: "Input tidak valid (tidak boleh kosong, maksimal berat 30 kg, minimal berat 1 gram",
                    isAlert : true
                })
            }
        )
    }

    handleChangeCityPengirim(content) {
        if (content == null) {
            this.setState(prevState =>({
                dataForm : {
                    ...prevState.dataForm,
                    cityPengirimId: ""
                }
            }));
        } else {
            this.setState(prevState =>({
                dataForm : {
                    ...prevState.dataForm,
                    cityPengirimId: content.value
                },
            }));
        }
    }

    handleChangeCityPenerima(content) {
        if (content == null) {
            this.setState(prevState =>({
                dataForm : {
                    ...prevState.dataForm,
                    cityPenerimaId: ""
                }
            }));
        } else {
            this.setState(prevState =>({
                dataForm : {
                    ...prevState.dataForm,
                    cityPenerimaId: content.value
                },
            }));
        }
    }

    handleChange(e) {
        const {name, value} = e.target
        this.setState((prevState => ({
            dataForm : {
                ...prevState.dataForm,
                [name] : value
            }
        })))
    }

    componentDidMount() {
        this.getCity()
    }

    render () {
        return (
            <Fragment>
                <Header bgNav={"#1EABFF"}/>
                <JumbotronKu image={bg}
                             jumboAfter={'linear-gradient(to right, rgba(19,54,113,1), rgba(19,54,113,0) 70%)'}
                             title={'Lacak'}/>
                <main>
                    <Container>
                        {/* navigasi */}
                        <div class="search-by">
                            <ButtonGroup>
                                {types.map(type => (
                                    <ButtonToggle
                                        key={type}
                                        active={this.state.active  === type}
                                        onClick={() => this.handleClickNavigasi(type)}>
                                        {type}
                                    </ButtonToggle>
                                ))}
                            </ButtonGroup>
                        </div>

                        {/* content */}
                        <div className="container container-form" style={this.state.active === types[1] ? {boxShadow: 'rgb(221 221 221) 0px 2px 12px 2px'} : {boxShadow: ""}}>
                            {/* lacak paket */}
                            <div className="form-lacak-paket" style={displayLacak}>
                                {/* lacak resi */}
                                <div className="form-lacak-paket">
                                    {/* search */}
                                    <div className="row">
                                        <div className="col-md-12 search">
                                            <input type="text" name="resi" id="resi" placeholder="masukkan nomor resi" value={this.state.resi} onChange={this.handleChangeInput}/>
                                            <div className="icon-hapus" onClick={this.handleDeleteResi}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </div>
                                        </div>
                                        <div className="col-md-12 tombol-search">
                                            <button className="btn btn-primary cari-resi" onClick={() => this.getDataResi(this.state.resi)}>Cari</button>
                                        </div>
                                    </div>
                                </div>

                                {/* image lacak */}
                                <div className="row gambar-lacak" style={{display : this.state.display}}>
                                    <div className="col-md-12 col-gambar-lacak">
                                        <img src={bgLacak} alt="lacak"/>
                                    </div>
                                </div>

                                {/* tabel resi */}
                                <div className="table-resi" style={{display : this.state.displayTable}}>
                                    <div className="table-responsive">
                                        <table className="table table-1">
                                            <thead>
                                            <tr>
                                                <th scope="col">Resi</th>
                                                <th scope="col">Tanggal Order</th>
                                                <th scope="col">Layanan</th>
                                                <th scope="col">Asal</th>
                                                <th scope="col">Tujuan</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="resi">{this.state.resi}</td>
                                                <td className="tgl">{this.state.data.tanggalTransaksi}</td>
                                                <td className="layanan">{this.state.data.kategoriLayanan}</td>
                                                <td className="asal">{this.state.data.cityName + ", " + this.state.data.provinceName}</td>
                                                <td className="tujuan">{this.state.data.cityNamePenerima + ", " + this.state.data.provinceNamePenerima}</td>
                                                <td className="status">{this.state.data.statusDelivery}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-2">
                                            <thead>
                                            <tr>
                                                <th scope="col">Kurir</th>
                                                <th scope="col">Penerima</th>
                                                <th scope="col">Tanggal Sampai</th>
                                                <th scope="col">Cetak</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="kurir">{this.state.data.namaKurir}</td>
                                                <td className="penerima">{this.state.data.namaPenerima}</td>
                                                <td className="tglSampai">{this.state.data.tanggalSampai}</td>
                                                <td className="col-print">
                                                    <div className="wadah-cetak">
                                                        <Tooltip title="pdf">
                                                            <div className="pdf" onClick={()=>this.getReport('pdf')}>
                                                                <i className="fas fa-file-pdf print">
                                                                    <FontAwesomeIcon icon={faFilePdf}/>
                                                                </i>
                                                            </div>
                                                        </Tooltip>
                                                        <Tooltip title="excel">
                                                            <div className="excel" onClick={()=>this.getReport("xlsx")}>
                                                                <i className="fas fa-file-excel print">
                                                                    <FontAwesomeIcon icon={faFileExcel}/>
                                                                </i>
                                                            </div>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* cek tarif */}
                            <div className="form-cek-tarif" style={displayTarif}>
                                <div className="container container-col-form">
                                    <div className="col-form">
                                        <div className="input-data-lacak">
                                            <Autocomplete
                                                style={{width: '100%'}}
                                                options={this.state.selectOptionCity}
                                                getOptionLabel={option => option.label}
                                                onChange={(e,content) => {
                                                    this.handleChangeCityPengirim(content)
                                                }}
                                                blurOnSelect
                                                renderInput={(params) =>
                                                    <TextField {...params} label="Dari" name="asal" onChange={this.handleChange} margin="normal" />}/>
                                            <Autocomplete
                                                style={{width: '100%'}}
                                                options={this.state.selectOptionCity}
                                                getOptionLabel={option => option.label}
                                                onChange={(a,content) => {
                                                    this.handleChangeCityPenerima(content)
                                                }}
                                                blurOnSelect
                                                renderInput={(params) => <TextField {...params} label="Ke" name="tujuan" onChange={this.handleChange} margin="normal" />}/>
                                            <TextField style={{width: '100%'}} onChange={this.handleChange} label="Berat Barang (gram)" name="beratBarang" />
                                        </div>
                                        <div className="btn-cek-tarif">
                                            <button className="btn btn-primary cari-layanan"
                                                    onClick={()=>this.getTarif(this.state.dataForm.cityPengirimId,
                                                                               this.state.dataForm.cityPenerimaId,
                                                                               this.state.dataForm.beratBarang)}>Cari</button>
                                        </div>
                                        <div className="table-ongkir" style={{display: this.state.displayTableTarif}}>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th scope="col">Layanan</th>
                                                        <th scope="col">Berat</th>
                                                        <th scope="col">Estimasi</th>
                                                        <th scope="col">Biaya Kirim</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="table-cek-tarif">
                                                        {this.state.dataTarif.map(cost => (
                                                            <tr>
                                                                <td>
                                                                    {cost.layanan}
                                                                </td>
                                                                <td>
                                                                    {cost.berat} Kg
                                                                </td>
                                                                <td>
                                                                    {cost.estimasi} Hari
                                                                </td>
                                                                <td className="biru">
                                                                    Rp.{cost.ongkir}
                                                                </td>
                                                            </tr>
                                                        ))}

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>

                    {/* modal loading*/}
                    <Loading display={this.state.displayLoading}/>

                    {/* alert error */}
                    <AlertKu isAlert={this.state.isAlert}
                             alertMessage={this.state.alertMessage}/>
                </main>
                <Footer />

            </Fragment>
        );
    }


}

export default Lacak;