import React from 'react';
import {Modal, Card, CardContent} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Zoom from '@material-ui/core/Zoom';

function ModalKu(props) {
    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalHeader: {
            textAlign: 'center',
            backgroundColor: props.headerColor,
            padding: '10px 0',
            color: '#fff',
        },
        modalBody: {
            position: 'relative',
            width: 450,
            backgroundColor: theme.palette.background.paper,
            borderRadius: '5px',
            boxShadow: theme.shadows[5],
            // padding: theme.spacing(2, 4, 3),
        },
        modalCardBody: {
            overflowY: 'scroll',
            height: '500px',
            '&::-webkit-scrollbar' : {
                display: 'none'
            },
            marginBottom: '20px',
        },
        iconos:{
            cursor: 'pointer'
        },
        modalBodyAlert: {
            position: 'relative',
            width: 500,
            backgroundColor: theme.palette.background.paper,
            borderRadius: '5px',
            boxShadow: theme.shadows[5],
            // padding: theme.spacing(2, 4, 3),
        },
        modalCardBodyAlert: {
            overflowY: 'scroll',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '50px 0',
            height: '100%',
            '&::-webkit-scrollbar' : {
                display: 'none'
            },
            margin: '0 20px',
        }
    }));

    const styles= useStyles();

    const modalBodyInsert=(
        <Card className={styles.modalBody}>
            <div className={styles.modalHeader}>
                <h3>{props.namaModalInsert}</h3>
            </div>
            <CardContent className={styles.modalCardBody}>
                {props.isiFormInsert}
            </CardContent>
        </Card>
    )

    const modalBodyEdit=(
        <Card className={styles.modalBody}>
            <div style={{textAlign: 'center', backgroundColor: '#133671', padding: '10px 0', color: '#fff'}}>
                <h3>{props.namaModalEdit}</h3>
            </div>
            <CardContent className={styles.modalCardBody}>
                {props.isiFormEdit}
            </CardContent>
        </Card>
    )

    //modal delete dan success
    const modalBodyAlert=(
        <Card className={styles.modalBodyAlert}>
            <CardContent className={styles.modalCardBodyAlert}>
                {props.isiFormAlert}
            </CardContent>
        </Card>
    )


    return (
        <div>
            {/* modal insert */}
            <Modal
                className={styles.modal}
                open={props.modalInsert}
                onClose={props.togglesInsert}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                disableScrollLock={true}>
                <Zoom in={props.modalInsert}>
                    {modalBodyInsert}
                </Zoom>
            </Modal>

            {/* modal edit */}
            <Modal
                className={styles.modal}
                open={props.modalEdit}
                onClose={props.togglesEdit}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                disableScrollLock={true}>
                <Zoom in={props.modalEdit}>
                    {modalBodyEdit}
                </Zoom>
            </Modal>

            {/* modal delete dan succes */}
            <Modal
                className={styles.modal}
                open={props.modalAlert}
                onClose={props.togglesAlert}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                disableScrollLock={true}>
                <Zoom in={props.modalAlert}>
                    {modalBodyAlert}
                </Zoom>
            </Modal>

        </div>
    )
}

export default ModalKu