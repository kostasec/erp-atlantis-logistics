-- ===============================
-- DROP view vw_ClientWithContacts
-- ===============================
IF OBJECT_ID('vw_ClientWithContacts', 'V') IS NOT NULL
    DROP VIEW vw_ClientWithContacts;
GO

-- ===============================
-- DROP view vw_CompositionDisplay
-- ================================
IF OBJECT_ID('vw_CompositionDisplay', 'V') IS NOT NULL
    DROP VIEW vw_CompositionDisplay;
GO

-- ================================
-- DROP vw_DriverCompositionDisplay
-- ================================
IF OBJECT_ID('vw_DriverCompositionDisplay', 'V') IS NOT NULL
    DROP VIEW vw_DriverCompositionDisplay;
GO

-- ==========================
-- DROP vw_CompositionSummary
-- ==========================
IF OBJECT_ID('vw_CompositionSummary', 'V') IS NOT NULL
    DROP VIEW vw_CompositionSummary;
GO

-- =================
-- DROP vw_Employee
-- =================
IF OBJECT_ID('vw_Employee', 'V') IS NOT NULL
    DROP VIEW vw_Employee;
GO

-- ==============
-- DROP vw_IncInv
-- ==============
IF OBJECT_ID('vw_IncInv', 'V') IS NOT NULL
    DROP VIEW vw_IncInv;
GO

-- ===========================
-- DROP vw_IncInvSenderCarrier
-- ===========================
IF OBJECT_ID('vw_IncInvSenderCarrier', 'V') IS NOT NULL
    DROP VIEW vw_IncInvSenderCarrier;
GO

-- ============================
-- DROP vw_IncInvSenderSupplier
-- ============================
IF OBJECT_ID('vw_IncInvSenderOther', 'V') IS NOT NULL
    DROP VIEW vw_IncInvSenderOther;
GO

-- ===========================================
-- DROP view vw_OutgoingInvoiceServicesSummary
-- ===========================================
IF OBJECT_ID('vw_ReadOutgoingInvoice', 'V') IS NOT NULL
    DROP VIEW vw_ReadOutgoingInvoice;
GO


-- ==============================
-- DROP view vw_VehicleInspection
-- ==============================
IF OBJECT_ID('vw_VehicleInspection', 'V') IS NOT NULL
    DROP VIEW vw_VehicleInspection;
GO

-- ===============================
-- DROP view vw_EmployeeInspection
-- ===============================
IF OBJECT_ID('vw_EmployeeInspection', 'V') IS NOT NULL
    DROP VIEW vw_EmployeeInspection;
GO

-- ======================
-- DROP view vw_WorkOrder
-- ======================
IF OBJECT_ID('vw_WorkOrder', 'V') IS NOT NULL
    DROP VIEW vw_WorkOrder;
GO

-- =======================
-- DROP view vw_PaySlipRSD
-- =======================
IF OBJECT_ID('vw_PaySlipRSD', 'V') IS NOT NULL
    DROP VIEW vw_PaySlipRSD;
GO

-- =======================
-- DROP view vw_PaySlipEUR
-- =======================
IF OBJECT_ID('vw_PaySlipEUR', 'V') IS NOT NULL
    DROP VIEW vw_PaySlipEUR;
GO


-- =================================
-- CREATE VIEW vw_ClientWithContacts
-- =================================
CREATE VIEW [dbo].[vw_ClientWithContacts] AS
SELECT 
        c.TaxID,
        c.ClientName,
        c.RegNmbr,
        c.StreetAndNmbr,
        c.City,
        c.ZIP,
        c.Country,
        c.Email,
        cp.ContactPersonID,
        cp.ContactName,
        cp.Description,
        cp.PhoneNmbr,
        cp.PersonEmail,
		c.isActive
FROM dbo.Client c
LEFT JOIN dbo.ContactPerson cp ON cp.TaxID = c.TaxID
WHERE c.IsActive = 1
GO

-- =================================
-- CREATE VIEW vw_CompositionDisplay
-- =================================
CREATE VIEW [dbo].[vw_CompositionDisplay] AS
SELECT
    c.TruckID,
    c.TrailerID,
    CONCAT(t1.RegistrationTag, '/', t2.RegistrationTag) AS CompositionName
FROM Composition c
JOIN Truck t1 ON t1.TruckID = c.TruckID
JOIN Trailer t2 ON t2.TrailerID = c.TrailerID
WHERE t1.Status= 'Active' AND t2.Status='Active';
GO

-- =======================================
-- CREATE VIEW vw_DriverCompositionDisplay
-- =======================================
CREATE VIEW [dbo].[vw_DriverCompositionDisplay] AS
SELECT
	dc.DriverID,
	CONCAT(e.FirstName, ' ', e.LastName) AS 'DriverName',
    t1.TruckID,
    t2.TrailerID,
    CONCAT(t1.RegistrationTag, '/', t2.RegistrationTag) AS CompositionName
FROM DriverComposition dc
JOIN Composition c ON dc.CompositionID = c.CompositionID
JOIN Truck t1 ON t1.TruckID = c.TruckID
JOIN Trailer t2 ON t2.TrailerID = c.TrailerID
LEFT JOIN Employee e ON e.EmplID=dc.DriverID
WHERE t1.Status= 'Active' AND t2.Status='Active';
GO

-- =================================
-- CREATE VIEW vw_CompositionSummary
-- =================================
CREATE VIEW [dbo].[vw_CompositionSummary] AS
SELECT 
    t1.Make AS TruckMake,
    t1.Model AS TruckModel,
    t1.RegistrationTag AS TruckTag,
    t2.Make AS TrailerMake,
    t2.Model AS TrailerModel,
    t2.RegistrationTag AS TrailerTag,
    e.FirstName + ' ' + e.LastName AS Driver
FROM Composition c
JOIN Truck t1 ON c.TruckID = t1.TruckID
JOIN Trailer t2 ON c.TrailerID = t2.TrailerID
JOIN DriverComposition dc ON c.CompositionID = dc.CompositionID
JOIN Employee e ON e.EmplID = dc.DriverID;
GO

-- =======================
-- CREATE VIEW vw_Employee
-- =======================
CREATE VIEW [dbo].[vw_Employee] AS
 SELECT e.EmplType, E.EmplID, e.FirstName, e.LastName, e.StreetAndNmbr, e.City, e.Country, e.PhoneNmbr, 
		e.EmailAddress, e.IDCardNmbr, e.PassportNmbr,m.FirstName+' '+m.LastName AS 'Manager', 
		c.CompositionName AS 'Vehicle',
		e.Status
            FROM Employee e 
            LEFT JOIN vw_DriverCompositionDisplay c on (e.EmplID=c.DriverID)
            LEFT JOIN Employee m on (m.EmplID=e.MgrID)
            WHERE e.EmplType='Driver'
			
UNION
SELECT e.EmplType, E.EmplID, e.FirstName, e.LastName, e.StreetAndNmbr, e.City, e.Country, e.PhoneNmbr, e.EmailAddress, 
		e.IDCardNmbr, e.PassportNmbr,m.FirstName+' '+m.LastName AS 'Manager', 
		c.RegistrationTag AS 'Vehicle',
		e.Status
            FROM Employee e
            LEFT JOIN EmployeeCar ec ON (e.EmplID=ec.EmplID)
            LEFT JOIN Car c ON (c.CarID=ec.CarID)
            LEFT JOIN Employee m ON (m.EmplID=e.MgrID)
            WHERE e.EmplType NOT IN ('Driver')
GO

-- ========================
-- CREATE VIEW vw_IncInvSEF
-- ========================
CREATE VIEW [dbo].[vw_IncInvSEF] AS
SELECT ii.IncInvID, ii.IncInvNmbr, ii.Amount, c.ClientName AS 'Sender', ds.DStatusName, ps.ProcessingStatusName, py.PaymentStatusName
FROM IncomingInvoice ii LEFT JOIN Client c ON ii.TaxID = c.TaxID
LEFT JOIN DocumentStatusList ds   ON ii.DocumentStatus = ds.DStatusID
LEFT JOIN ProcessingStatusList ps ON ii.ProcessingStatus = ps.ProcessingStatusID
LEFT JOIN PaymentStatusList py ON ii.PaymentStatus = py.PaymentStatusID
GO

-- ==================================
-- CREATE VIEW vw_IncInvSenderCarrier
-- ==================================
CREATE VIEW [dbo].[vw_IncInvSenderCarrier] AS
SELECT ii.IncInvID, ii.IncInvNmbr, ii.Amount, ii.Currency, ii.TransactionDate, ii.DueDate, 
ii.IssueDate, c.ClientName AS 'Sender', py.PaymentStatusName
FROM IncomingInvoice ii 
JOIN (
    SELECT TaxID, ClientName 
    FROM Client 
    WHERE ClientType = 'Carrier'
) c ON ii.TaxID = c.TaxID
LEFT JOIN PaymentStatusList py    ON ii.PaymentStatus = py.PaymentStatusID
GO

-- ===================================
-- CREATE VIEW vw_IncInvSenderSupplier
-- ===================================
CREATE VIEW [dbo].[vw_IncInvSenderSupplier] AS
SELECT ii.IncInvID,ii.IncInvNmbr, ii.Amount, ii.Currency, ii.TransactionDate, ii.DueDate, 
ii.IssueDate, c.ClientName AS 'Sender', py.PaymentStatusName
FROM IncomingInvoice ii 
JOIN (
    SELECT TaxID, ClientName 
    FROM Client 
    WHERE ClientType = 'Supplier'
) c ON ii.TaxID = c.TaxID
LEFT JOIN PaymentStatusList py    ON ii.PaymentStatus = py.PaymentStatusID
GO

-- =============================================
-- CREATE VIEW vw_OutgoingInvoiceServicesSummary
-- ==============================================
CREATE VIEW [dbo].[vw_OutgoingInvoiceServicesSummary] AS
SELECT 
    
c.ClientName AS Recipient,
inv.InvoiceID, inv.outInvoiceNmbr as 'InvoiceNumber',
s.ServiceID,s.ServiceType,

CAST(
        ISNULL(SUM(ISNULL(ts.Price, 0)*i.Quantity), 0) + ISNULL(SUM(ISNULL(tx.Price, 0)*i.Quantity), 0) + ISNULL(SUM(ISNULL(os.Price, 0)*i.Quantity), 0)
    AS DECIMAL(18, 2))
    AS TaxBase,

i.VatCode AS VatCode,

CAST(
	  ISNULL(v.VATPercentage, 0)
	AS DECIMAL(18, 2))*100
	AS VATRate,

CAST(
		ISNULL(SUM(ISNULL(ts.Price, 0)	 * i.Quantity	* ISNULL(v.VATPercentage, 0)), 0)
		+ ISNULL(SUM(ISNULL(tx.Price, 0) * i.Quantity	* ISNULL(v.VATPercentage, 0)), 0)
		+ ISNULL(SUM(ISNULL(os.Price, 0) * i.Quantity	* ISNULL(v.VATPercentage, 0)), 0)
	AS DECIMAL(18, 2))
	AS VATAmount,

CAST(
		ISNULL(SUM(ISNULL(ts.Price, 0)		* i.Quantity	* (1 + ISNULL(v.VATPercentage, 0))), 0)
		+ ISNULL(SUM(ISNULL(tx.Price, 0)	* i.Quantity	* (1 + ISNULL(v.VATPercentage, 0))), 0)
		+ ISNULL(SUM(ISNULL(os.Price, 0)	* i.Quantity	* (1 + ISNULL(v.VATPercentage, 0))), 0)
	AS DECIMAL(18, 2))
	AS TotalAmount,

	inv.Currency AS Currency,
	ds.DStatusName AS DocumentStatus,
	ps.ProcessingStatusName AS ProcessingStatus,
	py.PaymentStatusName,
	inv.TransDate,
	inv.IssueDate,
	inv.DueDate


FROM Item i
LEFT JOIN Service s                   ON i.ServiceID=s.ServiceID
LEFT JOIN TransportationService ts    ON s.ServiceID = ts.ServiceID
LEFT JOIN TaxService tx               ON s.ServiceID = tx.ServiceID
LEFT JOIN OutsorcingService os        ON s.ServiceID = os.ServiceID
LEFT JOIN VATCodeList v               ON i.VATCode = v.VATCode
LEFT JOIN OutgoingInvoice inv		  ON i.InvoiceID = inv.InvoiceID
LEFT JOIN Client c					  ON inv.TaxID=c.TaxID
LEFT JOIN dbo.DocumentStatusList ds   ON inv.DocumentStatus = ds.DStatusID
LEFT JOIN dbo.ProcessingStatusList ps ON inv.ProcessingStatus = ps.ProcessingStatusID
LEFT JOIN dbo.PaymentStatusList py    ON inv.PaymentStatus = py.PaymentStatusID

GROUP BY inv.InvoiceID, inv.OutInvoiceNmbr,inv.Currency,
I.VATCode,S.ServiceType,S.ServiceID,VATPercentage,c.ClientName, ds.DStatusName, ps.ProcessingStatusName, py.PaymentStatusName, inv.TransDate, inv.IssueDate, inv.DueDate
GO


-- ================================
-- CREATE VIEW vw_VehicleInspection
-- ================================
CREATE VIEW vw_VehicleInspection AS
SELECT t.RegistrationTag, i.Name, ti.OldDate, ti.NewDate
FROM TrailerInspection ti
JOIN Trailer t ON t.TrailerID=ti.TrailerID
JOIN Inspection i ON ti.InspectionID=i.InspectionID
UNION
SELECT t.RegistrationTag, i.Name, ti.OldDate, ti.NewDate
FROM TruckInspection ti
JOIN Truck t ON t.TruckID=ti.TruckID
JOIN Inspection i ON ti.InspectionID=i.InspectionID
UNION
SELECT c.RegistrationTag, i.Name, ci.OldDate, ci.NewDate
FROM CarInspection ci
JOIN Car c ON c.CarID=ci.CarID
JOIN Inspection i ON ci.InspectionID=i.InspectionID
GO

-- =================================
-- CREATE VIEW vw_EmployeeInspection
-- =================================
CREATE VIEW vw_EmployeeInspection AS
SELECT e.FirstName+' '+e.LastName AS 'Employee', i.Name, ei.OldDate, ei.NewDate 
FROM EmployeeInspection ei
JOIN Employee e ON ei.EmployeeID=e.EmplID
JOIN Inspection i ON ei.InspectionID=i.InspectionID
GO

-- ========================
-- CREATE VIEW vw_WorkOrder
-- ========================
CREATE VIEW [dbo].[vw_WorkOrder] AS
SELECT wo.OrderID, wo.OrderCode, wo.OrderDate, wo.Amount, wo.PaymentTerm, wo.Note AS 'GeneralNote', c.ClientName,
li.Firm AS 'LoadingFirm', li.LoadingAdress, li.Goods, li.Customs AS 'LoadingCustoms', li.ForwAgency AS 'LoadingForwAgency', li.Border AS 'LoadingBorder', li.Note AS 'LoadingNote',
ui.Firm AS 'UnloadingFirm', ui.UnloadingAdress, ui.Customs AS 'UnloadingCustoms', ui.ForwAgency AS 'UnloadingForwAgency', ui.Note AS 'UnloadingNote', ui.UnloadingDate
FROM WorkOrder wo
JOIN LoadingItem li ON wo.OrderID = li.OrderID
JOIN UnloadingItem ui ON wo.OrderID = ui.OrderID
JOIN Client c ON wo.ClientID = c.TaxID
GO

-- =========================
-- CREATE VIEW vw_PaySlipRSD
-- =========================
CREATE VIEW [dbo].[vw_PaySlipRSD] AS
SELECT p.PaySlip_ID, p.IssueDate, psi.PS_RSD_ID AS 'PsID', psi.OrderNmbr, psi.Date as 'TransactionDate', al.Quantity*al.Amount as 'Allowance', ex.Amount as 'Costs', e.FirstName as 'Employee'
FROM PaySliP p
JOIN PS_RSD ps ON ps.PaySlip_ID = p.PaySlip_ID 
JOIN PS_ItemRSD psi ON psi.PS_RSD_ID = ps.PS_RSD_ID
JOIN AllowanceRSD al ON al.OrderNmbr = psi.OrderNmbr
JOIN ExpenseRSD ex ON ex.OrderNmbr = psi.OrderNmbr
JOIN Employee e ON e.EmplID = p.EmplID
GO



-- =========================
-- CREATE VIEW vw_PaySlipEUR
-- =========================
CREATE VIEW [dbo].[vw_PaySlipEUR] AS
SELECT p.PaySlip_ID, p.IssueDate, psi.PS_EUR_ID AS 'PsID', psi.OrderNmbr,Date as 'TransactionDate',  al.Quantity*al.Amount as 'Allowance', ex.Amount as 'Costs', e.FirstName as 'Employee'
FROM PaySliP p
JOIN PS_EUR ps ON ps.PaySlip_ID = p.PaySlip_ID 
JOIN PS_ItemEUR psi ON psi.PS_EUR_ID = ps.PS_EUR_ID
JOIN AllowanceEUR al ON al.OrderNmbr = psi.OrderNmbr
JOIN ExpenseEUR ex ON ex.OrderNmbr = psi.OrderNmbr
JOIN Employee e ON e.EmplID = p.EmplID
GO



