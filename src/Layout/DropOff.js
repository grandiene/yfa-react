import React, {Component, Fragment} from 'react';
import axios from "axios";
import '../Style/DropOff.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {makeStyles} from "@material-ui/core";

import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Row
} from "reactstrap";

import Select from 'react-select'
import Header from "../Components/Header";
import JumbotronKu from "../Components/JumbotronKu";
import Footer from "../Components/Footer";
import bg from "../img/1.jpg"
import {
    faBalanceScaleRight,
    faCity, faEnvelopeSquare, faFileSignature,
    faMap,
    faMapMarked, faMapMarkerAlt,
    faPhone,
    faPhoneAlt,
    faSearchLocation, faSortAmountUp, faTaxi,
    faUserEdit
} from "@fortawesome/free-solid-svg-icons";
import ModalKu from "../Components/ModalKu";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

function NamaLabel(props) {
    return <label style={{fontWeight:"bold", marginLeft:"10px"}}>{props.name}</label>;
}

var cityId
var cityIdPenerima
var berat

class DropOff extends Component {
    constructor() {
        super(); //merujuk ke parent jd identitas yg ada di parent ada juga di anak
        this.state = {
            selectOptions: [],
            selectOptionsKota: [],
            selectOptionsKotaPenerima: [],
            selectOptionLayanan: [],

            province_id: "",
            provinceName: "",
            provinceIdPenerima: "",
            provinceNamePenerima: "",
            city_id: "",
            city_name: "",
            city_idpenerima: "",
            city_namepenerima: "",
            ongkir: "",
            estimasi: "",
            layanan: "",

            email: localStorage.getItem("email"),

            namaPengirim: "",
            telpPengirim: "",
            alamatPengirim: "",
            kodePosPengirim: "",
            namaPenerima: "",
            telpPenerima: "",
            alamatPenerima: "",
            kodePosPenerima: "",
            namaBarang: "",
            jumlahBarang: "",

            setDetail: false,
            modalSuccess:false,
            displayDetail: 'none'
        }
        this.toggleSuccess = this.toggleSuccess.bind(this)
    }

    //digunakan untuk mengisi si value input yg diketik
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    //digunakan untuk mengisi si input berat yg diketik
    handleChangeBerat = (e) => {
        this.setState({[e.target.name]: e.target.value})
        berat = e.target.value
    }

    // axios: menghubungkan api be dengan fe
    async getOptions() {
        const res = await axios.get('http://localhost:3333/api/provinsi'
        //     , {
        //     headers: {'Content-Type': 'application/json'}
        // }
        )
        const data = res.data
        const options = data.map(d => ({
            "value": d.province_id,
            "label": d.province
        }))
        this.setState({selectOptions: options})
    }

    async handleChangeSelectProvince(e) {
        this.setState({
            province_id: e.value,
            provinceName: e.label
        })
        const province_id = e.value
        const res = await axios.get("http://localhost:3333/api/kotaRaja/" + province_id
        //     , {
        //     headers: {'Content-Type': 'application/json'}
        // }
        )

        const data = res.data
        const options = data.map(d => ({
            "value": d.city_id,
            "label": d.type + " " + d.city_name
        }))
        this.setState({selectOptionsKota: options})
    }

    async handleChangeSelectProvincePenerima(e) {
        this.setState({
            provinceIdPenerima: e.value,
            provinceNamePenerima: e.label
        })
        const provinceIdPenerima = e.value
        const res = await axios.get("http://localhost:3333/api/kotaRaja/" + provinceIdPenerima
        //     , {
        //     headers: {'Content-Type': 'application/json'}
        // }
        )
        const data = res.data
        const options = data.map(d => ({
            "value": d.city_id,
            "label": d.type + " " + d.city_name
        }))
        this.setState({selectOptionsKotaPenerima: options})
    }

    async handleRequestCost(e) {
        const res = await axios.get("http://localhost:3333/api/cost/" + cityId + "/" + cityIdPenerima + "/" + berat
        //     , {
        //     headers: {'Content-Type': 'application/json'}
        // }
        )
        const data = res.data
        const options = data.map(d => ({
            "value": d.cost[0].value,
            "label": d.service,
            "title": d.cost[0].etd
        }))
        this.setState({
            selectOptionLayanan: options,
            displayDetail: 'block'
        })
    }

    handleChangeSelectKota(e) {
        this.setState({
            city_id: e.value,
            city_name: e.label
        })
        cityId = e.value
    }

    handleChangeSelectKotaPenerima(e) {
        this.setState({
            city_idpenerima: e.value,
            city_namepenerima: e.label
        })
        cityIdPenerima = e.value
    }

    handleChangeSelectLayanan(e) {
        this.setState({
            ongkir: e.value,
            estimasi: e.title,
            layanan: e.label,
            setDetail: true,
        })
    }

    componentDidMount() {
        this.getOptions()
    }

    onSubmit = (e) => {
        const formData = {
            "namaPengirim": this.state.namaPengirim,
            "telpPengirim": this.state.telpPengirim,
            "provinceName": this.state.provinceName,
            "cityName": this.state.city_name,
            "alamatPengirim": this.state.alamatPengirim,
            "kodePosPengirim": this.state.kodePosPengirim,

            "namaPenerima": this.state.namaPenerima,
            "telpPenerima": this.state.telpPenerima,
            "provinceNamePenerima": this.state.provinceNamePenerima,
            "cityNamePenerima": this.state.city_namepenerima,
            "alamatPenerima": this.state.alamatPenerima,
            "kodePosPenerima": this.state.kodePosPenerima,

            "namaBarang": this.state.namaBarang,
            "jumlahBarang": this.state.jumlahBarang,
            "beratBarang": this.state.beratBarang,

            "kategoriLayanan": this.state.layanan,
            "ongkosKirim": this.state.ongkir,
            "estimasi": this.state.estimasi,

            "email": this.state.email,
            "statusDelivery": this.state.statusDelivery,
            "fotoPenerima": this.state.fotoPenerima,
            "penerimaPaket": this.state.penerimaPaket

        };

        console.log(formData)

        axios.post("http://localhost:3333/api/transaksi", formData)
            .then(res => {
                console.log(res.data)
                this.toggleSuccess()
            })

    }

    //modal success
    toggleSuccess(e) {
        this.setState({
            modalSuccess : !this.state.modalSuccess
        })
    }

    //isi modal success
    contentFormSuccess () {
        return (
            <Fragment>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <CheckCircleOutlineIcon style={{color: '#006A4E', fontSize: '100'}}/>
                </div>
                <div style={{margin: '20px', textAlign: 'center'}}>
                    <p style={{margin: '0', color: 'rgba(0,0,0,.5)'}}>Anda Berhasil Order, Silahkan Drop Off Barang Anda ke Kantor YFA Express Terdekat</p>
                </div>
                <div align="center">
                    <Button style={{marginRight: '5px', background:'#006A4E', color: '#ffffff'}} href="/user/transaksi"
                            onClick={this.toggleSuccess}>Oke</Button>
                </div>
            </Fragment>
        )
    }

    render() {
        return (
            <Fragment>
                <Header bgNav={"#133671"}/>
                <JumbotronKu image={bg}
                             jumboAfter={'linear-gradient(to right, rgba(30,171,255,1), rgba(30,171,255,0) 70%)'}
                             title={'Drop Off'}/>
                <main>
                    <Container fluid style={{paddingLeft: "50px", paddingRight: "50px"}}>
                        <Row>
                            <Col md="6">
                                <Card className="main-card mb-3">
                                    <CardBody className="bgcolumn">
                                        <CardTitle><h5 style={{fontWeight:"bold"}}>Informasi Pengirim</h5></CardTitle>
                                        <Form>
                                            <Input id="idPengirim" name="idPengirim" type="hidden"/>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faUserEdit}/>
                                                <NamaLabel name="Nama Pengirim :"/>
                                                <Input type="text" name="namaPengirim" id="namaPengirim" required={true}
                                                       onChange={this.handleChange}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faPhoneAlt}/>
                                                <NamaLabel name="  No Telp :" />
                                                <Input type="tel" name="telpPengirim" id="telpPengirim"
                                                       maxLength={13}
                                                       required={true}
                                                       onChange={this.handleChange} />
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faSearchLocation}/>
                                                <NamaLabel name="  Provinsi :"/>
                                                <Select type="select" name="province_id" id="province"
                                                        placeholder="Pilih Provinsi" required={true}
                                                        options={this.state.selectOptions}
                                                        onChange={this.handleChangeSelectProvince.bind(this)} />
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faCity}/>
                                                <NamaLabel name="Kota Asal :"/>
                                                <Select name="city_id" id="city_name"
                                                        placeholder="Pilih Kota"
                                                        required={true}
                                                        options={this.state.selectOptionsKota}
                                                        onChange={this.handleChangeSelectKota.bind(this)}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                                <NamaLabel name="Alamat :"/>
                                                <Input type="text" name="alamatPengirim" id="alamatPengirim" required={true}
                                                       onChange={this.handleChange} />
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faEnvelopeSquare}/>
                                                <NamaLabel name="Kode Pos :"/>
                                                <Input type="text"
                                                       name="kodePosPengirim"
                                                       id="kodePosPengirim"
                                                       maxLength={5}
                                                       required={true}
                                                       onChange={this.handleChange} />
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="6">
                                <Card className="main-card mb-3">
                                    <CardBody className="bgcolumn">
                                        <CardTitle><h5 style={{fontWeight:"bold"}}>Informasi Penerima</h5></CardTitle>
                                        <Form>
                                            <Input id="idPenerima" name="idPenerima" type="hidden"/>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faUserEdit}/>
                                                <NamaLabel name="Nama Penerima :"/>
                                                <Input type="text" name="namaPenerima" id="namaPenerima" required={true}
                                                       onChange={this.handleChange} />
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faPhoneAlt}/>
                                                <NamaLabel name="No Telp :"/>
                                                <Input type="tel" name="telpPenerima" id="telpPenerima"
                                                       maxLength={13}
                                                       required={true}
                                                       onChange={this.handleChange} />
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faSearchLocation}/>
                                                <NamaLabel name="Provinsi :"/>
                                                <Select name="province_id" id="provincepenerima"
                                                        placeholder="Pilih Provinsi"
                                                        options={this.state.selectOptions}
                                                        onChange={this.handleChangeSelectProvincePenerima.bind(this)}
                                                        required={true}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faCity}/>
                                                <NamaLabel name="Kota Tujuan :"/>
                                                <Select name="city_id" id="city_name"
                                                        placeholder="Pilih Kota"
                                                        options={this.state.selectOptionsKotaPenerima}
                                                        onChange={this.handleChangeSelectKotaPenerima.bind(this)}
                                                        required={true}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                                <NamaLabel name="Alamat :"/>
                                                <Input type="text" name="alamatPenerima" id="alamatPenerima" required={true}
                                                       onChange={this.handleChange}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faEnvelopeSquare}/>
                                                <NamaLabel name="Kode Pos :"/>
                                                <Input type="text"
                                                       name="kodePosPenerima"
                                                       id="kodePosPenerima"
                                                       maxLength={5}
                                                       required={true}
                                                       onChange={this.handleChange} required/>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="12">
                                <Card className="main-card mb-3">
                                    <CardBody className="bgcolumn">
                                        <CardTitle><h5 style={{fontWeight:"bold"}}>Informasi Barang</h5></CardTitle>
                                        <Form>
                                            <Input id="idBarang" name="idBarang" type="hidden"/>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faFileSignature}/>
                                                <NamaLabel name="Nama Barang :"/>
                                                <Input type="text" name="namaBarang" id="namaBarang" required={true}
                                                       onChange={this.handleChange} />
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faSortAmountUp}/>
                                                <NamaLabel name="Jumlah Barang :"/>
                                                <Input type="text" name="jumlahBarang" id="jumlahBarang" required={true}
                                                       onChange={this.handleChange} />
                                            </FormGroup>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faBalanceScaleRight}/>
                                                <NamaLabel name="Total Berat Barang (gram) :"/>
                                                <Input type="number" name="beratBarang" id="kategoriBeratBarang"
                                                       onChange={this.handleChangeBerat} required={true}/>
                                            </FormGroup>
                                            <Button className="mb-2 mr-2 btn-icon" color="primary" id="btn-cekharga"
                                                    type="button" onClick={this.handleRequestCost.bind(this)}>
                                                <i className="pe-7s-tools btn-icon-wrapper"> </i>
                                                Cek Harga
                                            </Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="12" style={{display: this.state.displayDetail}}>
                                <Card className="main-card mb-3">
                                    <CardBody className="bgcolumn">
                                        <CardTitle><h5>Total Harga</h5></CardTitle>
                                        <Form>
                                            <Input id="idtotalBiaya" name="idtotalBiaya" type="hidden"/>
                                            <FormGroup>
                                                <FontAwesomeIcon icon={faTaxi}/>
                                                <NamaLabel name="Pilih Layanan :"/>
                                                <Select type="select" name="layanan_id" id="layanan"
                                                        placeholder="Pilih Layanan"
                                                        options={this.state.selectOptionLayanan}
                                                        onChange={this.handleChangeSelectLayanan.bind(this)}
                                                        required={true}/>
                                            </FormGroup>
                                            <FormGroup className="ongkirajadeh">
                                                <NamaLabel name="Total Biaya Kirim :"/>
                                                <p>Rp. <span
                                                    id="ongkosKirimSpan">{this.state.setDetail ? this.state.ongkir : 0}</span>
                                                </p>
                                                <NamaLabel name="Estimasi : "/>
                                                <p><span
                                                    id="waktuKirim">{this.state.setDetail ? this.state.estimasi : "-"}</span> Hari
                                                </p>
                                            </FormGroup>
                                            <Button className="mb-2 mr-2 btn-icon" color="info" id="btn-save-utama"
                                                    type="button" onClick={this.onSubmit}>
                                                <i className="pe-7s-science btn-icon-wrapper"> </i>
                                                Order
                                            </Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <ModalKu headerColor={'#133671'}
                                 isiFormAlert={this.contentFormSuccess()}
                                 modalAlert={this.state.modalSuccess}
                                 togglesAlert={this.toggleSuccess}
                        />
                    </Container>

                </main>
                <Footer/>

            </Fragment>
        );
    }
}

export default DropOff;