sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
        "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Fragment, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
        },

        onCarPress: function (oEvent) {
            let oItem = oEvent.getParameter("listItem");
            let oContext = oItem.getBindingContext("Cars");
            let sPath = oContext.getPath();
            let sCarID = this.getView().getModel("Cars").getProperty(sPath).ID;
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("Detail", { carID: sCarID });
        },

        onInputLiveChange: function (oEvent) {
            let oInput = oEvent.getSource(),
                sValue = oInput.getValue(),
                phonePattern = /^\d{3}-\d{3}-\d{3}$/;  // Format: 123-456-789
            emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Format: example@domain.com

            if (oInput.getId() === this.createId("phoneInput")) {
                if (!phonePattern.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid phone number format. Use format 123-456-789.");
                } else {
                    oInput.setValueState("None");
                }
            }

            if (oInput.getId() === this.createId("emailInput")) {
                if (!emailPattern.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid email format.");
                } else {
                    oInput.setValueState("None");
                }
            }
        },

        onAddCar: function () {
            let oView = this.getView();

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "project1.view.fragment.AddCar",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this.pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onSaveCar: function () {
            let oView = this.getView(),
                oModel = oView.getModel('Cars'),
                aCars = oModel.getData().Cars;

            let sMarka = oView.byId("MarkaInput").getValue(),
                sModel = oView.byId("ModelInput").getValue(),
                sRok = oView.byId("RokInput").getValue(),
                sVIN = oView.byId("VINInput").getValue(),
                sNumer = oView.byId("NumerInput").getValue(),
                sPrzebieg = oView.byId("PrzebiegInput").getValue(),
                sPaliwo = oView.byId("PaliwoInput").getValue(),
                sOsoba = oView.byId("OsobaInput").getValue();

            if (!sMarka || !sModel || !sRok || !sVIN || !sNumer || !sPrzebieg || !sPaliwo || !sOsoba) {
                MessageToast.show("Please fill in required fields.");
                return;
            }

            let newCar = {
                "ID": (aCars.length + 1).toString(),
                "Marka": sMarka,
                "Model": sModel,
                "Rok": sRok,
                "RegistrationNumber": sNumer,
                "VIN": sVIN,
                "Mileage": sPrzebieg,
                "FuelType": sPaliwo,
                "AssignedTo": sOsoba,
                "Description": "Świeżo dodany samochód."
            };

            aCars.push(newCar);
            oModel.setProperty("/Cars", aCars);

            MessageToast.show("Car added!");
            this._clearForm();
            this.onCancelCar();
        },

        onCancelCar: function () {
            this.pDialog.then(function (oDialog) {
                oDialog.close();
            });
            this._clearForm();
        },

        _clearForm: function () {
            let oView = this.getView(),
                aInputs = [
                    "MarkaInput",
                    "ModelInput",
                    "RokInput",
                    "VINInput",
                    "NumerInput",
                    "PrzebiegInput",
                    "PaliwoInput",
                    "OsobaInput"
                ];

            aInputs.forEach(function (sInputId) {
                let oInput = oView.byId(sInputId);
                if (oInput) {
                    oInput.setValue("");
                    oInput.setValueState("None");
                }
            });
        },

        onDeleteCar: function () {
            let oTable = this.getView().byId("table"),
                aSelectedItems = oTable.getSelectedItems(); // Zwraca tablicę zaznaczonych elementów

            // Pobieramy model z listą użytkowników
            let oModel = this.getView().getModel("Cars");
            let aCars = oModel.getProperty("/Cars");

            // Usuwamy użytkowników na podstawie zaznaczonego indeksu
            aSelectedItems.forEach(function (oItem) {
                let oContext = oItem.getBindingContext("Cars");
                let sCarID = oContext.getProperty("ID"); // Pobieramy ID użytkownika
                let iIndex = aCars.findIndex(car => car.ID === sCarID);
                if (iIndex !== -1) {
                    aCars.splice(iIndex, 1); // Usuwamy pracownika
                }
            });

            // aktualizujemy model
            oModel.setProperty("/Cars", aCars);

            // Wyczyść wybór w tabeli
            oTable.removeSelections(true);

            this.getView().byId("removeCarBtn").setEnabled(false);

            MessageToast.show("Car deleted successfully.");
        },

        onItemSelected: function () {
            let oTable = this.getView().byId("table"),
                oRemoveButton = this.getView().byId("removeCarBtn"),
                aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length > 0) {
                oRemoveButton.setEnabled(true);
            } else {
                oRemoveButton.setEnabled(false);
            }
        },

        onFilterChange: function () {
            let oView = this.getView(),
                oTable = oView.byId("table"),
                sName = oView.byId("idMarkaInput").getValue(),
                sModel = oView.byId("idModelInput").getValue(),
                sRok = oView.byId("idRokInput").getValue(),
                aFilters = [];

            // Tworzenie filtrów na podstawie wartości wprowadzonych przez użytkownika
            if (sName) {
                aFilters.push(new Filter("Marka", FilterOperator.Contains, sName));
            }

            if (sModel) {
                aFilters.push(new Filter("Model", FilterOperator.Contains, sModel));
            }

            if (sRok) {
                aFilters.push(new Filter("Rok", FilterOperator.Contains, sRok));
            }

            let oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter(aFilters);
            }
        }

    });
});