sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageToast) => {
    "use strict";

    return Controller.extend("project1.controller.Detail", {

        onInit: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);

            let oEditModel = new JSONModel({
                editMode: false
            });
            this.getView().setModel(oEditModel, "editModel");
        },

        _onObjectMatched: function (oEvent) {
            let sCarID = oEvent.getParameter("arguments").carID,
                oModel = this.getView().getModel("Cars"),
                aCars = oModel.getProperty("/Cars"),
                oCar = aCars.find(car => car.ID === sCarID),
                oCarModel = new sap.ui.model.json.JSONModel(oCar);

            this.getView().setModel(oCarModel, "carModel");
        },

        onBackPress: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView1");
        },

        onEditPress: function () {
            this.getView().getModel("editModel").setProperty("/editMode", true);
        },

        onSavePress: function () {
            let oCarModel = this.getView().getModel("carModel"),
                oCarData = oCarModel.getData();

            // Zaktualizowanie danych w modelu "Cars"
            let oCarsModel = this.getView().getModel("Cars"),
                aCars = oCarsModel.getProperty("/Cars");

            let iIndex = aCars.findIndex(car => car.ID === oCarData.ID);
            if (iIndex !== -1) {
                aCars[iIndex] = oCarData; // Aktualizacja danych
            }

            oCarsModel.setProperty("/Cars", aCars);

            this.getView().getModel("editModel").setProperty("/editMode", false);

            MessageToast.show("Car details saved successfully.");
        },

        // Funkcja anulująca edycję
        onCancelPress: function () {
            // Przywrócenie początkowych danych użytkownika
            let oCarModel = this.getView().getModel("carModel"),
                oCarData = oCarModel.getData();

            // Ponownie ustawiamy dane w modelu, aby anulować zmiany
            let oModel = this.getView().getModel("Cars"),
                aCars = oModel.getProperty("/Cars"),
                oOriginalCar = aCars.find(car => car.ID === oCarData.ID);
            oCarModel.setData(oOriginalCar);

            this.getView().getModel("editModel").setProperty("/editMode", false);

            MessageToast.show("Changes canceled.");
        },

    });
});
