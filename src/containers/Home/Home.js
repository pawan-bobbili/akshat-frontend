import React from "react";
import axios from "axios";
import makeToast from "../../components/Toaster";

import Modal from "./Modal/Modal";
import Form from "../Form/Form";

import styles from "./Home.module.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medicines: [
        {
          id: 1,
          name: "hellohellohellohellohellohellohellohellohello",
          id1: 1,
          name1: "hello",
          id2: 1,
          name2: "hello",
          id3: 1,
          name3: "hello",
        },
        {
          id: 2,
          name: "bye",
          id1: 2,
          name1: "bye",
          id2: 2,
          name2: "bye",
          id3: 2,
          name3: "bye",
        },
      ],
      showModal: false,
      isEditing: false,
      formdata: {
        rxRequired: false,
        price: 0,
        name: "",
        packing: 0,
        discount: 0,
        validated: false,
        composition: "",
        brandName: "",
      },
      editingId: null,
      search: "",
    };
  }
  componentDidMount() {
    axios
      .get("https://sahiyog.herokuapp.com/medicine/getAllMedicines")
      .then((response) => {
        const medicines = response.data.medicine;
        this.setState({ medicines: medicines });
      })
      .catch((err) => makeToast("error", "Request Failed"));
  }

  deleteHandler = (e, id) => {
    console.log(id);
    e.preventDefault();
    axios
      .delete(`https://sahiyog.herokuapp.com/medicine/deleteMedicine/:${id}`)
      .then(() => {
        makeToast("success", "Deleted Succesfully !!");
        let medicines = [...this.state.medicines];
        medicines = medicines.filter((med) => med._id !== id);
        this.setState({ medicines: medicines });
      })
      .catch((err) => makeToast("error", "Request Failed"));
  };

  startEditHandler = (e, id) => {
    console.log(id);
    e.preventDefault();
    const medicine = this.state.medicines.find((med) => med._id === id);
    console.log(medicine);
    const formdata = {};
    for (let key in medicine) {
      if (key !== "_id" && key !== "__v") {
        formdata[key] = medicine[key];
      }
    }
    this.setState({
      isEditing: true,
      showModal: true,
      editingId: id,
      formdata: formdata,
    });
  };

  startCreateHandler = (e) => {
    e.preventDefault();
    const form = {};
    for (let key in this.state.medicines[0]) {
      if (key !== "__id" && key !== "__v") {
        if (key === "rxRequired" || key === "validated") {
          form[key] = false;
        } else if (key === "discount" || key === "price") {
          form[key] = 0;
        } else {
          form[key] = "";
        }
      }
    }
    this.setState({ isEditing: false, showModal: true, formdata: form });
  };

  submissionHandler = (e) => {
    e.preventDefault();
    if (this.state.isEditing) {
      axios
        .put(
          `https://sahiyog.herokuapp.com/medicine/updateMedicine/:${this.state.editingId}`
        )
        .then((response) => {
          makeToast("success", "Edited Succesfully");
          const medicines = [...this.state.medicines];
          let size = medicines.length;
          let i = 0;
          while (i < size) {
            if (medicines[i]._id === this.state.editingId) {
              for (let key in this.state.formdata) {
                medicines[i][key] = this.state.formdata[key];
              }
              break;
            }
            i++;
          }
          this.setState({
            medicines: medicines,
            editingId: null,
            isEditing: false,
            showModal: false,
          });
        })
        .catch((err) => makeToast("error", "Request Failed"));
    } else {
      axios
        .post("https://sahiyog.herokuapp.com/medicine/createMedicine")
        .then((response) => {
          makeToast("success", "Created Successfull !!");
          this.setState({ showModal: false });
        })
        .catch((err) => makeToast("error", "Request failed"));
    }
  };

  clearModal = (e) => {
    e.preventDefault();
    this.setState({ showModal: false });
  };

  checkBoxHandler = (e) => {
    let key = e.target.name;
    const form = { ...this.state.formdata };
    form[key] = !form[key];
    this.setState({ formdata: form });
  };

  inputChangeHandler = (e) => {
    e.persist();
    const form = { ...this.state.formdata };
    form[e.target.name] = e.target.value;
    this.setState({ formdata: form });
  };

  searchHandler = (e) => {
    e.persist();
    this.setState({ search: e.target.value });
  };

  render() {
    const arr = [];
    let dummy = this.state.medicines[0];
    const temp1 = [];
    for (let key in dummy) {
      if (key !== "_id" && key !== "__v") {
        temp1.push(
          <i className={styles.detail}>
            <strong>{key}</strong>
          </i>
        );
      }
    }
    arr.push(<p style={{ whiteSpace: "nowrap" }}>{temp1}</p>);
    this.state.medicines.forEach((med) => {
      if (med.name.startsWith(this.state.search)) {
        const temp = [];
        for (let key in med) {
          if (key !== "_id" && key !== "__v") {
            if (key === "rxRequired" || key === "validated") {
              temp.push(
                <i className={styles.detail}>{med[key] ? "Yes" : "No"}</i>
              );
            } else {
              temp.push(<i className={styles.detail}>{med[key]}</i>);
            }
          }
        }
        temp.push(
          <button
            style={{ display: "inline-block", marginRight: "8px" }}
            className="btn btn-primary"
            onClick={(e) => this.startEditHandler(e, med["_id"])}
          >
            Edit
          </button>
        );
        temp.push(
          <button
            style={{ display: "inline-block" }}
            className="btn btn-danger"
            onClick={(e) => this.deleteHandler(e, med["_id"])}
          >
            Delete
          </button>
        );
        arr.push(<p style={{ whiteSpace: "nowrap" }}>{temp}</p>);
      }
    });
    return (
      <React.Fragment>
        <Modal
          show={this.state.showModal}
          modalclosed={(e) => this.clearModal(e)}
        >
          <Form
            submitHandler={(e) => this.submissionHandler(e)}
            checkBoxHandler={(e) => this.checkBoxHandler(e)}
            onChangeValues={(e) => this.inputChangeHandler(e)}
            cancel={(e) => this.clearModal(e)}
            data={this.state.formdata}
          />
        </Modal>
        <button
          type="button"
          className={["btn btn-primary", styles.button].join(" ")}
          onClick={(e) => this.startCreateHandler(e)}
        >
          Create Medicine
        </button>
        <form className={["form-inline", styles.search].join(" ")}>
          <i className="fas fa-search" aria-hidden={true}></i>
          <input
            className="form-control form-control-sm ml-3 w-75"
            type="text"
            placeholder="Search"
            aria-label="Search"
            style={{ width: "500px" }}
            value={this.state.search}
            onChange={this.searchHandler}
          />
        </form>
        <div className={styles.container}>{arr}</div>
      </React.Fragment>
    );
  }
}

export default Home;
