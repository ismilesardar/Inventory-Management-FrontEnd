import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ErrorToast, IsEmpty } from "../../helper/FormHelper";

import {
  CreateUpdateExpenseRequest,
  ExpenseTypeDropDownRequest,
  FillExpenseFormRequest,
} from "../../APIRequest/ExpenseApiRequest";
import { OnChangeExpenseInput } from "../../redux/slice/expenseSlice";
import store from "../../redux/store/store";

const ExpenseCreateUpdate = () => {
  let [ObjectID, SetObjectID] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await ExpenseTypeDropDownRequest();
    })();

    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    if (id !== null) {
      SetObjectID(id);
      (async () => {
        await FillExpenseFormRequest(id);
      })();
    }
  }, []);

  const FormValue = useSelector((state) => state.expense.FormValue);
  let ExpenseTypeDropDown = useSelector(
    (state) => state.expense.ExpenseTypeDropDown
  );

  const SaveChange = async () => {
    if (IsEmpty(FormValue.TypeID)) {
      ErrorToast("Expense TypeID Required !");
    } else if (FormValue.Amount === 0) {
      ErrorToast("Expense Amount Required !");
    } else {
      let result = await CreateUpdateExpenseRequest(FormValue, ObjectID);
      if (result) {
        navigate("/expenseList");
      }
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <h2>Save Expense</h2>
                  <hr className="bg-light" />

                  <div className="col-4 p-2">
                    <label className="form-label">Expense Name</label>
                    <select
                      onChange={(e) => {
                        store.dispatch(
                          OnChangeExpenseInput({
                            Name: "TypeID",
                            Value: e.target.value,
                          })
                        );
                      }}
                      value={FormValue.TypeID}
                      className="form-select form-select-sm"
                    >
                      <option value="">Select Type</option>
                      {ExpenseTypeDropDown.map((item, i) => {
                        return (
                          <option key={i.toLocaleString()} value={item._id}>
                            {item.Name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-4 p-2">
                    <label className="form-label">Expense Amount</label>
                    <input
                      onChange={(e) => {
                        store.dispatch(
                          OnChangeExpenseInput({
                            Name: "Amount",
                            Value: parseInt(e.target.value),
                          })
                        );
                      }}
                      value={FormValue.Amount}
                      className="form-control form-control-sm"
                      type="number"
                    />
                  </div>
                  <div className="col-4 p-2">
                    <label className="form-label">Expense Note</label>
                    <input
                      onChange={(e) => {
                        store.dispatch(
                          OnChangeExpenseInput({
                            Name: "Note",
                            Value: e.target.value,
                          })
                        );
                      }}
                      value={FormValue.Note}
                      className="form-control form-control-sm"
                      type="text"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4 p-2">
                    <button
                      onClick={SaveChange}
                      className="btn btn-sm my-3 btn-success"
                    >
                      Save Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseCreateUpdate;
