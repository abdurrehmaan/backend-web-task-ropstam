const functions = require("firebase-functions");
const admin = require("firebase-admin")
const express = require("express")
const cors = require("cors");
const { snapshotConstructor } = require("firebase-functions/v1/firestore");


const app = express();
app.use(cors({ origin: true }))
admin.initializeApp();
const db = admin.firestore();


// add vehical
app.post('/insertvehicle', async (req, res) => {
    try {
        console.log(req.body)
        const id = `${Date.now()}`
        await db.collection('vehicle_details').doc(id).set({
            id: id,
            company: req.body.company,
            modal: req.body.modal,
            owner: req.body.owner,
            category: req.body.category,
        })
        return res.status(200).send({ Status: "Sucess", msg: "Data Saved" })

    } catch (error) {
        return res.status(404).send({ Status: "Failed", msg: "Data not Saved" })
    }
})

// get All vechical
app.get('/allvehicle', async (req, res) => {
    try {
        const document = db.collection('vehicle_details');
        let response = [];
        await document.get().then(Snapshot => {
            let docs = Snapshot.docs;
            for (let doc of docs) {
                const selectitem = {
                    id: doc.id,
                    name: doc.data().name,
                    company: doc.data().company,
                    modal: doc.data().modal,
                    owner: doc.data().owner,
                    category: doc.data().category,
                }
                response.push(selectitem)
            }
            return response;
        })

        return res.status(200).send(response)

    } catch (error) {
        console.log(error)
        return res.status(404 ).send("Data Failed to get")
    }
})


// update vehical info
app.put('/updatevehicle/:id', async (req, res) => {
    try {
        // console.log(req.body)
        const document = await db.collection('vehicle_details').doc(req.params.id).update({
            company: req.body.company,
            modal: req.body.modal,
            owner: req.body.owner,
            category: req.body.category,
        });
        // console.log("document", document)
        return res.status(200).send("Data is updated")
    }
    catch (error) {
        return res.status(404).send("Data is not updated")
    }
})

// delete vehicle info
app.delete('/deletevehicle/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const document = db.collection('vehicle_details').doc(req.params.id);
        await document.delete();

        return res.status(200).send("data is deleted")

    } catch {
        return res.status(404).send("data is not deleted")
    }
})


exports.app = functions.https.onRequest(app)