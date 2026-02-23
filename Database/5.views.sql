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

-- ====================
-- DROP vw_EmployeeBack
-- ====================
IF OBJECT_ID('vw_EmployeeBack', 'V') IS NOT NULL
    DROP VIEW vw_EmployeeBack;
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

-- =========================
-- DROP vw_IncInvSenderOther
-- =========================
IF OBJECT_ID('vw_IncInvSenderOther', 'V') IS NOT NULL
    DROP VIEW vw_IncInvSenderOther;
GO

-- ===========================================
-- DROP view vw_OutgoingInvoiceServicesSummary
-- ===========================================
IF OBJECT_ID('vw_ReadOutgoingInvoice', 'V') IS NOT NULL
    DROP VIEW vw_ReadOutgoingInvoice;
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
        cp.PersonEmail
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
    dc.TruckID,
    dc.TrailerID,
    CONCAT(t1.RegistrationTag, '/', t2.RegistrationTag) AS CompositionName
FROM DriverComposition dc
JOIN Truck t1 ON t1.TruckID = dc.TruckID
JOIN Trailer t2 ON t2.TrailerID = dc.TrailerID
LEFT JOIN Employee e ON e.EmplID=dc.DriverID
WHERE t1.Status= 'Active' AND t2.Status='Active';
GO

-- ===========================
-- CREATE VIEW vw_EmployeeBack
-- ===========================
CREATE VIEW [dbo].[vw_EmployeeBack] AS
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

-- =====================
-- CREATE VIEW vw_IncInv
-- =====================
CREATE VIEW [dbo].[vw_IncInv] AS
SELECT ii.IncInvID, ii.Amount, c.ClientName AS 'Sender', ds.DStatusName, ps.ProcessingStatusName, py.PaymentStatusName
FROM IncomingInvoice ii LEFT JOIN Client c ON ii.TaxID = c.TaxID
LEFT JOIN DocumentStatusList ds   ON ii.DocumentStatus = ds.DStatusID
LEFT JOIN ProcessingStatusList ps ON ii.ProcessingStatus = ps.ProcessingStatusID
LEFT JOIN PaymentStatusList py ON ii.PaymentStatus = py.PaymentStatusID
GO

-- ==================================
-- CREATE VIEW vw_IncInvSenderCarrier
-- ==================================
CREATE VIEW [dbo].[vw_IncInvSenderCarrier] AS
SELECT ii.IncInvID, ii.Amount, ii.Currency, ii.TransactionDate, ii.DueDate, 
ii.IssueDate, c.ClientName AS 'Sender', py.PaymentStatusName
FROM IncomingInvoice ii 
JOIN (
    SELECT TaxID, ClientName 
    FROM Client 
    WHERE ClientType = 'Carrier'
) c ON ii.TaxID = c.TaxID
LEFT JOIN PaymentStatusList py    ON ii.PaymentStatus = py.PaymentStatusID
GO

-- ================================
-- CREATE VIEW vw_IncInvSenderOther
-- ================================
CREATE VIEW [dbo].[vw_IncInvSenderOther] AS
SELECT ii.IncInvID, ii.Amount, ii.Currency, ii.TransactionDate, ii.DueDate, 
ii.IssueDate, c.ClientName AS 'Sender', py.PaymentStatusName
FROM IncomingInvoice ii 
JOIN (
    SELECT TaxID, ClientName 
    FROM Client 
    WHERE ClientType = 'Other'
) c ON ii.TaxID = c.TaxID
LEFT JOIN PaymentStatusList py    ON ii.PaymentStatus = py.PaymentStatusID
GO

-- =============================================
-- CREATE VIEW vw_OutgoingInvoiceServicesSummary
-- ==============================================
CREATE VIEW [dbo].[vw_OutgoingInvoiceServicesSummary] AS
SELECT 
    
c.ClientName AS Recipient,
inv.outInvoiceNmbr as 'InvoiceNumber',
s.ServiceType,

CAST(
        ISNULL(SUM(ISNULL(ts.Price, 0)), 0) + ISNULL(SUM(ISNULL(tx.Price, 0)), 0) + ISNULL(SUM(ISNULL(os.Price, 0)), 0)
    AS DECIMAL(18, 2))
    AS TaxBase,

CAST(
		ISNULL(i.Discount, 0)
	AS DECIMAL(18, 2))*100
	AS DiscountRate,
	
CAST(
		ISNULL(SUM(ISNULL(ts.Price, 0) * ISNULL(i.Discount, 0)), 0)
		+ ISNULL(SUM(ISNULL(tx.Price, 0) * ISNULL(i.Discount, 0)), 0)
		+ ISNULL(SUM(ISNULL(os.Price, 0) * ISNULL(i.Discount, 0)), 0)
	AS DECIMAL(18, 2))
	AS Discount,

CAST(
		ISNULL(SUM(ISNULL(ts.Price, 0) * (1 - ISNULL(i.Discount, 0))), 0)
		+ ISNULL(SUM(ISNULL(tx.Price, 0) * (1 - ISNULL(i.Discount, 0))), 0)
		+ ISNULL(SUM(ISNULL(os.Price, 0) * (1 - ISNULL(i.Discount, 0))), 0)
	AS DECIMAL(18, 2))
    AS Subtotal,

i.VatCode AS VatCode,

CAST(
	  ISNULL(v.VATPercentage, 0)
	AS DECIMAL(18, 2))*100
	AS VATRate,

CAST(
		ISNULL(SUM(ISNULL(ts.Price, 0) * (1 - ISNULL(i.Discount, 0)) * ISNULL(v.VATPercentage, 0)), 0)
		+ ISNULL(SUM(ISNULL(tx.Price, 0) * (1 - ISNULL(i.Discount, 0)) * ISNULL(v.VATPercentage, 0)), 0)
		+ ISNULL(SUM(ISNULL(os.Price, 0) * (1 - ISNULL(i.Discount, 0)) * ISNULL(v.VATPercentage, 0)), 0)
	AS DECIMAL(18, 2))
	AS VATAmount,

CAST(
		ISNULL(SUM(ISNULL(ts.Price, 0) * (1 - ISNULL(i.Discount, 0)) * (1 + ISNULL(v.VATPercentage, 0))), 0)
		+ ISNULL(SUM(ISNULL(tx.Price, 0) * (1 - ISNULL(i.Discount, 0)) * (1 + ISNULL(v.VATPercentage, 0))), 0)
		+ ISNULL(SUM(ISNULL(os.Price, 0) * (1 - ISNULL(i.Discount, 0)) * (1 + ISNULL(v.VATPercentage, 0))), 0)
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


GROUP BY inv.InvoiceID, inv.OutInvoiceNmbr,inv.Currency,I.Discount,
I.VATCode,S.ServiceType,S.ServiceID,VATPercentage,c.ClientName, ds.DStatusName, ps.ProcessingStatusName, py.PaymentStatusName, inv.TransDate, inv.IssueDate, inv.DueDate
GO
