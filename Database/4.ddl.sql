-- ==============
-- DROP Tables
-- ===============
IF OBJECT_ID('CarInspection', 'U') IS NOT NULL
    DROP TABLE CarInspection;
GO
IF OBJECT_ID('TruckInspection', 'U') IS NOT NULL
    DROP TABLE TruckInspection;
GO
IF OBJECT_ID('TrailerInspection', 'U') IS NOT NULL
    DROP TABLE TrailerInspection;
GO
IF OBJECT_ID('EmployeeInspection', 'U') IS NOT NULL
    DROP TABLE EmployeeInspection;
GO
IF OBJECT_ID('Inspection', 'U') IS NOT NULL
    DROP TABLE Inspection;
GO
IF OBJECT_ID('InspectionOther','U') IS NOT NULL
   DROP TABLE InspectionOther;
GO
IF OBJECT_ID('PaymentEUR', 'U') IS NOT NULL
    DROP TABLE PaymentEUR;
GO
IF OBJECT_ID('PaymentRSD', 'U') IS NOT NULL
    DROP TABLE PaymentRSD;
GO
IF OBJECT_ID('AllowanceRSD', 'U') IS NOT NULL
    DROP TABLE AllowanceRSD;
GO
IF OBJECT_ID('ExpenseRSD', 'U') IS NOT NULL
    DROP TABLE ExpenseRSD;
GO
IF OBJECT_ID('PS_ItemRSD', 'U') IS NOT NULL
    DROP TABLE PS_ItemRSD;
GO
IF OBJECT_ID('PS_RSD', 'U') IS NOT NULL
    DROP TABLE PS_RSD;
GO
IF OBJECT_ID('AllowanceEUR', 'U') IS NOT NULL
    DROP TABLE AllowanceEUR;
GO
IF OBJECT_ID('ExpenseEUR', 'U') IS NOT NULL
    DROP TABLE ExpenseEUR;
GO
IF OBJECT_ID('PS_ItemEUR', 'U') IS NOT NULL
    DROP TABLE PS_ItemEUR;
GO
IF OBJECT_ID('PS_EUR', 'U') IS NOT NULL
    DROP TABLE PS_EUR;
GO
IF OBJECT_ID('PaySlip', 'U') IS NOT NULL
    DROP TABLE PaySlip;
GO

IF OBJECT_ID('TaxService', 'U') IS NOT NULL
    DROP TABLE TaxService;
GO
IF OBJECT_ID('TransportationService', 'U') IS NOT NULL
    DROP TABLE TransportationService;
GO
IF OBJECT_ID('OutsorcingService', 'U') IS NOT NULL
    DROP TABLE OutsorcingService;
GO
IF OBJECT_ID('Service', 'U') IS NOT NULL
    DROP TABLE Service;
GO
IF OBJECT_ID('VATExamptionReason', 'U') IS NOT NULL
    DROP TABLE VATExamptionReason;
GO
IF OBJECT_ID('EmployeeCar', 'U') IS NOT NULL
    DROP TABLE EmployeeCar;
GO
IF OBJECT_ID('DriverComposition', 'U') IS NOT NULL
    DROP TABLE DriverComposition;
GO
IF OBJECT_ID('Composition', 'U') IS NOT NULL
    DROP TABLE Composition;
GO
IF OBJECT_ID('Trailer', 'U') IS NOT NULL
    DROP TABLE Trailer;
GO
IF OBJECT_ID('Truck', 'U') IS NOT NULL
    DROP TABLE Truck;
GO
IF OBJECT_ID('Car', 'U') IS NOT NULL
    DROP TABLE Car;
GO
IF OBJECT_ID('dbo.DocumentStatusList', 'U') IS NOT NULL
    DROP TABLE dbo.DocumentStatusList;
GO
IF OBJECT_ID('dbo.PaymentStatusList', 'U') IS NOT NULL
    DROP TABLE dbo.PaymentStatusList;
GO
IF OBJECT_ID('dbo.ProcessingStatusList', 'U') IS NOT NULL
    DROP TABLE dbo.ProcessingStatusList;
GO
IF OBJECT_ID('OutgoingInvoice', 'U') IS NOT NULL
    DROP TABLE OutgoingInvoice;
GO
IF OBJECT_ID('Item', 'U') IS NOT NULL
    DROP TABLE Item;
GO
IF OBJECT_ID('IncomingInvoice', 'U') IS NOT NULL
    DROP TABLE IncomingInvoice;
GO
IF OBJECT_ID('ContactPerson', 'U') IS NOT NULL
    DROP TABLE ContactPerson;
GO
IF OBJECT_ID('VATCodeList', 'U') IS NOT NULL
    DROP TABLE VATCodeList;
GO
IF OBJECT_ID('LoadingItem', 'U') IS NOT NULL
    DROP TABLE LoadingItem;
GO
IF OBJECT_ID('UnloadingItem', 'U') IS NOT NULL
    DROP TABLE UnloadingItem;
GO
IF OBJECT_ID('WorkOrder', 'U') IS NOT NULL
    DROP TABLE WorkOrder;
GO

IF OBJECT_ID('Client', 'U') IS NOT NULL
    DROP TABLE Client;
GO
IF OBJECT_ID('Employee', 'U') IS NOT NULL
    DROP TABLE Employee;
GO
-- =============
-- Table: Client
-- =============
CREATE TABLE Client (
    TaxID 			NVARCHAR(50) 	PRIMARY KEY,
    RegNmbr 		NVARCHAR(30) 	UNIQUE,
    ClientName 		NVARCHAR(100) 	NOT NULL,
    StreetAndNmbr 	NVARCHAR(100) 	NOT NULL,
    City 			NVARCHAR(50) 	NOT NULL,
    ZIP 			NVARCHAR(10) 	NOT NULL,
    Country 		NVARCHAR(50) 	NOT NULL,
    IsActive 		BIT 			NOT NULL 					DEFAULT 1,
    Email 			NVARCHAR (100),
    ClientType 		NVARCHAR (10)
);
GO

-- ====================
-- Table: ContactPerson
-- ====================
CREATE TABLE ContactPerson(
    ContactPersonID 	INT 				IDENTITY(1,1) 			PRIMARY KEY
    ContactName 	NVARCHAR(255) 	  	NOT NULL,
    Description 	NVARCHAR(255),
    PhoneNmbr 		NVARCHAR(50),
    PersonEmail 	NVARCHAR(100),
    TaxID 			NVARCHAR(50) 	  	NOT NULL,
    ClientType 		NVARCHAR(10) 	  	NOT NULL 				CHECK (ClientType IN ('Supplier', 'Transportation')),
    CONSTRAINT fk_ContactPerson_TaxID 	FOREIGN KEY (TaxID) 	REFERENCES Client(TaxID),
);
GO

-- =================
-- Table: WorkOrder
-- =================
CREATE TABLE WorkOrder(
    OrderID 		INT 				IDENTITY(1,1) 			PRIMARY KEY,
    OrderDate 		DATE 				NOT NULL 				DEFAULT GETDATE(),
    OrderCode AS (
        'N-' + CAST(OrderID AS NVARCHAR(10)) + '/' + CAST(YEAR(OrderDate) AS NVARCHAR(4))
    ) PERSISTED,
    Amount 			DECIMAL (18,2) 		NOT NULL,
    Currency 		NVARCHAR(5) 		NOT NULL,
    Note 			NVARCHAR(30),	
    ClientID 		NVARCHAR(50) 		NOT NULL,
    CONSTRAINT fk_WorkORder_ClientID 	FOREIGN KEY (ClientID) REFERENCES Client (TaxID)
);
-- ===================
-- Table: LoadingItem
-- ===================
CREATE TABLE LoadingItem(
	LoadingID 		INT 				IDENTITY 				PRIMARY KEY,
	Firm 			NVARCHAR (50) 		NOT NULL,
	LoadingDate 	NVARCHAR(20) 		NOT NULL,
	LoadingAdress 	NVARCHAR (50) 		NOT NULL,
	Goods 			NVARCHAR(50) 		NOT NULL,
	Customs 		NVARCHAR(50) 		NOT NULL,
	ForwAgency 		NVARCHAR(50) 		NOT NULL,
	Border 			NVARCHAR(50) 		NOT NULL,
	Note 			NVARCHAR(50) 		NOT NULL,
	OrderID 		INT 				NOT NULL,
	CONSTRAINT fk_LoadingOrder 			FOREIGN KEY (OrderID) REFERENCES WorkOrder(OrderID)
);

-- ====================
-- Table: UnloadingItem
-- ====================
CREATE TABLE UnloadingItem(
	UnloadingID 	INT 				IDENTITY 				PRIMARY KEY,
	Firm 			NVARCHAR (50) 		NOT NULL,
	UnloadingDate 	VARCHAR(20) 		NOT NULL,
	UnloadingAdress NVARCHAR(50) 		NOT NULL,
	Customs 		NVARCHAR(50) 		NOT NULL,
	ForwAgency 		NVARCHAR(50) 		NOT NULL,
	Note 			NVARCHAR(50) 		NOT NULL,
	OrderID 		INT 				NOT NULL,
	CONSTRAINT fk_UnloadingOrder 		FOREIGN KEY (OrderID) 	REFERENCES WorkOrder(OrderID)
);

-- =========================
-- Table: DocumentStatusList 
-- =========================
CREATE TABLE DocumentStatusList (
    DStatusID 				TINYINT 		PRIMARY KEY,
    DStatusName 			NVARCHAR(10) 	NOT NULL,
    
);
GO

-- ===========================
-- Table: ProcessingStatusList 
-- ===========================
CREATE TABLE ProcessingStatusList (
    ProcessingStatusID 		TINYINT 		PRIMARY KEY,
    ProcessingStatusName 	NVARCHAR(10) 	NOT NULL,
    
);
GO

-- ========================
-- Table: PaymentStatusList 
-- ========================
CREATE TABLE PaymentStatusList (
    PaymentStatusID 	TINYINT 			PRIMARY KEY,
    PaymentStatusName 	NVARCHAR(10) 		NOT NULL,
    
);
GO

-- ======================
-- Table: IncomingInvoice
-- ======================
CREATE TABLE IncomingInvoice (
    IncInvID 			INT 				IDENTITY(1,1) 		PRIMARY KEY,
    IncInvNmbr 			NVARCHAR(15) 		NOT NULL,
    Amount 				NUMERIC(18, 2) 		NOT NULL,
    Currency 			NVARCHAR(10) 		NOT NULL,
    TransactionDate 	DATE 				NOT NULL,
    DueDate 			DATE 				NOT NULL,
    IssueDate 			DATE 				NOT NULL,
    DocumentStatus 		INT 				NOT NULL
    CONSTRAINT fk_IncomingInvoice_DocumentStatus 				FOREIGN KEY (DocumentStatus) 		REFERENCES DocumentStatusList(DStatusID),
    PaymentStatus 		TINYINT 			NOT NULL
    CONSTRAINT fk_IncomingInvoice_PaymentStatusID 				FOREIGN KEY (PaymentStatus) 		REFERENCES PaymentStatusList(PaymentStatusID),
    ProcessingStatus 	TINYINT 			NOT NULL
    CONSTRAINT fk_IncomingInvoice_ProcessingStatusID 			FOREIGN KEY (ProcessingStatus) 		REFERENCES ProcessingStatusList (ProcessingStatusID),
    TaxID 				NVARCHAR(50) 		NOT NULL,
    CONSTRAINT fk_IncomingInvoice_TaxID 	NOT NULL 			FOREIGN KEY (TaxID) 				REFERENCES Client(TaxID)
);
GO

-- ======================
-- Table: OutgoingInvoice
-- ======================
CREATE TABLE OutgoingInvoice (
    InvoiceID 			INT 				IDENTITY(1,1) 		PRIMARY KEY,
    OutInvoiceNmbr 		NVARCHAR(50) 		  UNIQUE 			NOT NULL,
    Currency 			NVARCHAR(10) 							NOT NULL,
    ReferenceNmbr 		NVARCHAR(50) 							NOT NULL,
    OrderNmbr 			NVARCHAR(50),
    TransDate 			DATE 									NOT NULL,
    IssueDate 			DATE 									NOT NULL,
    DueDate 			DATE 									NOT NULL,
    Attachment NNVARCHAR(500), -- file path
    Note 				NVARCHAR(255),
    DocumentStatus 		TINYINT 								NOT NULL
    CONSTRAINT fk_OutgoingInvoice_DocumentStatus 				FOREIGN KEY (DocumentStatus)		REFERENCES DocumentStatusList(DStatusID),
    PaymentStatus 		TINYINT 				NOT NULL
    CONSTRAINT fk_OutgoingInvoice_PaymentStatusID 				FOREIGN KEY (PaymentStatus) 		REFERENCES PaymentStatusList(PaymentStatusID),
    ProcessingStatus 	TINYINT 				NOT NULL
    CONSTRAINT fk_OutgoingInvoice_ProcessingStatusID 			FOREIGN KEY (ProcessingStatus) 		REFERENCES ProcessingStatusList (ProcessingStatusID),
    TaxID 				NVARCHAR(50) 			NOT NULL,
    CONSTRAINT fk_OutgoingInvoice_TaxID 						FOREIGN KEY (TaxID) 				REFERENCES Client(TaxID)
);
GO

-- ===============
-- Table: Employee
-- ================
CREATE TABLE Employee (
    EmplID 				INT 				IDENTITY(1,1) 		PRIMARY KEY,
    EmplType 			NVARCHAR(50) 		NOT NULL,
    FirstName 			NVARCHAR(50) 		NOT NULL,
    LastName 			NVARCHAR(50) 		NOT NULL,
    Status 				NVARCHAR(20) 		NOT NULL,
    CONSTRAINT ck_Employee_Status 			CHECK (Status IN ('Active','Inactive')),
    StreetAndNmbr 		NVARCHAR(100) 		NOT NULL,
    City 				NVARCHAR(50) 		NOT NULL,
    ZIPCode 			NVARCHAR(10) 		NOT NULL,
    Country 			NVARCHAR(50) 		NOT NULL,
    PhoneNmbr 			NVARCHAR(50) 		NOT NULL,
    EmailAddress 		NVARCHAR(50),
    IDCardNmbr 			NVARCHAR(20) 		NOT NULL,
    PassportNmbr 		NVARCHAR(20) 		NOT NULL,
    MgrID 				INT,
    CONSTRAINT fk_Employee_MgrID 			FOREIGN KEY (MgrID) 								REFERENCES Employee(EmplID)
);
GO

-- ============
-- Table: Truck
-- ============
CREATE TABLE Truck (
    TruckID 		INT 					IDENTITY(1,1) 										PRIMARY KEY,
    Make 			NVARCHAR(50) 			NOT NULL,
    Model 			NVARCHAR(50) 			NOT NULL,
    RegistrationTag NVARCHAR(20) 			NOT NULL,
    Status 			NVARCHAR(10) 			NOT NULL

);
GO

-- ==============
-- Table: Trailer
-- ==============
CREATE TABLE Trailer (
    TrailerID 		INT 					IDENTITY(1,1) 										PRIMARY KEY,
    Make 			NVARCHAR(50) 			NOT NULL,
    Model 			NVARCHAR(50) 			NOT NULL,
    RegistrationTag NVARCHAR(20) 			NOT NULL,
    Status 			NVARCHAR(10) 			NOT NULL
);
GO

-- ==========
-- Table: Car
-- ==========
CREATE TABLE Car(
    CarID 			INT 					IDENTITY(1,1) 										PRIMARY KEY,
    Make 			NVARCHAR(50) 			NOT NULL,
    Model 			NVARCHAR(50) 			NOT NULL,
    RegistrationTag NVARCHAR(20) 			NOT NULL,
    Status 			NVARCHAR(10) 			NOT NULL
);
GO

-- ==================
-- Table: Composition
-- ==================
CREATE TABLE Composition (
    CompositionID INT 						IDENTITY(1,1) 										PRIMARY KEY,
    TruckID 	  INT 						NOT NULL,
    TrailerID 	  INT 						NOT NULL,
    FOREIGN KEY (TruckID) 					REFERENCES 											Truck(TruckID),
    FOREIGN KEY (TrailerID) 				REFERENCES 											Trailer(TrailerID)
);

-- ========================
-- Table: DriverComposition
-- ========================
CREATE TABLE DriverComposition (
    DriverCompID 	INT 										IDENTITY (1,1) PRIMARY KEY,
    DriverID 		INT 										NOT NULL,
    CompositionID 	INT 										NOT NULL,
    FOREIGN KEY (DriverID) 										REFERENCES Employee(EmplID),
    FOREIGN KEY (CompositionID) 								REFERENCES Composition(CompositionID),
);
GO

-- ==================
-- Table: EmployeeCar
-- ==================
CREATE TABLE EmployeeCar (
    ID 				INT 										PRIMARY KEY IDENTITY(1,1),
    EmplID 			INT 										NOT NULL,
    CarID 			INT 										NOT NULL,
    FOREIGN KEY (EmplID) 										REFERENCES Employee(EmplID),
    FOREIGN KEY (CarID) 										REFERENCES Car(CarID),
);
GO

-- ==================
-- Table: VATCodeList
-- ==================
CREATE TABLE VATCodeList(
    VATCode 		NVARCHAR(6) 								PRIMARY KEY,
    VATPercentage 	DECIMAL(3,2)
);
GO

-- =========================
-- Table: VATExamptionReason
-- =========================
CREATE TABLE VATExamptionReason(
    VATCode 		 NVARCHAR(6) 								NOT NULL,
    VATExamptionCode NVARCHAR(50) 								NOT NULL,
    CONSTRAINT fk_VATExamptionReason_VATCode 					FOREIGN KEY (VATCode) REFERENCES VATCodeList (VATCode),
    CONSTRAINT pk_VATExamptionReason 							PRIMARY KEY (VATCode,VATExamptionCode)
);
GO

-- ==============
-- Table: Service
-- ==============
CREATE TABLE Service(
	ServiceID 		INT IDENTITY(1,1) 							PRIMARY KEY,
	ServiceType 	NVARCHAR(20)
);
GO

-- ============================
-- Table: TransportationService
-- ============================
CREATE TABLE TransportationService (
    ServiceID 		INT,
    Route 			NVARCHAR(100) 								NOT NULL,
    Price 			DECIMAL(18, 2) 								NOT NULL,
    CompositionID 	INT 										NOT NULL,
    CONSTRAINT fk_TranService_ServiceID 						FOREIGN KEY(ServiceID)
    REFERENCES Service(ServiceID),
    CONSTRAINT fk_TransServiceComposition 						FOREIGN KEY(CompositionID)
    REFERENCES Composition(CompositionID),
    CONSTRAINT pk_TransportationService 						PRIMARY KEY(ServiceID)
);	
GO

-- =================
-- Table: TaxService
-- =================
CREATE TABLE TaxService(
	ServiceID 		INT,
	Name 			NVARCHAR(100),
	Price 			DECIMAL(18,2),
	CONSTRAINT fk_TaxService_ServiceID 							FOREIGN KEY(ServiceID)
    REFERENCES Service(ServiceID),
    CONSTRAINT pk_TaxService 									PRIMARY KEY(ServiceID)	
);
GO

-- ==============================
-- Table: OutsourcingServiceTable
-- ==============================
CREATE TABLE OutsourcingServiceTable (
	ServiceID 		INT,
	Route 			NVARCHAR(100),
	Price 			DECIMAL(18,2),
	RegTag 			NVARCHAR(50),
	CONSTRAINT fk_TaxService_ServiceID 							FOREIGN KEY(ServiceID)
    REFERENCES Service(ServiceID),
    CONSTRAINT pk_TaxService 									PRIMARY KEY(ServiceID)	
);
GO

-- ===========
-- Table: Item
-- ===========
CREATE TABLE Item(
	InvoiceID 			INT 									NOT NULL,
	ServiceID 			INT										NOT NULL,
	UoM 				NVARCHAR(5),
	Quantity 			INT,
	VATCode 			NVARCHAR(6) 							NOT NULL,
	VATExamptionCode 	NVARCHAR(50),
	CONSTRAINT pk_Item 											PRIMARY KEY(InvoiceID, ServiceID),
	CONSTRAINT fk_Item_Vat 										FOREIGN KEY (VATCode, VATExamptionCode) REFERENCES VATExamptionReason (VATCode, VATExamptionCode)
);
GO



-- =================
-- Table: PaymentRSD
-- =================
CREATE TABLE PaymentRSD(
    PaymentID_RSD 		INT IDENTITY(1,1) 					PRIMARY KEY,
    AmountRSD 			INT,
    Date 				DATE 								NOT NULL,
);
GO

-- =================
-- Table: PaymentEUR
-- =================
CREATE TABLE PaymentEUR(
    PaymentID_EUR 			INT IDENTITY(1,1) 				PRIMARY KEY,
    AmountEUR 				INT,
    Date 					DATE 							NOT NULL,
    EmplID 					INT 							NOT NULL,
    CONSTRAINT fk_PaymentEUR_EmplID 						FOREIGN KEY (EmplID) REFERENCES Employee(EmplID)
);
GO
-- ==============
-- Table: PaySlip
-- ==============
CREATE TABLE PaySlip(
	PaySlip_ID 				INT IDENTITY (1,1) 				PRIMARY KEY,
	IssueDate 				DATE 							NOT NULL,
	EmplID 					INT 							NOT NULL,
    CONSTRAINT fk_PaySlip_EmplID FOREIGN KEY (EmplID) 		REFERENCES Employee(EmplID)
)

-- =============
-- Table: PS_RSD
-- =============
CREATE TABLE PS_RSD (
    PS_RSD_ID 				INT IDENTITY(1,1) 				PRIMARY KEY,
	PaySlip_ID 				INT NOT NULL,
	CONSTRAINT fk_PS_RSD 	FOREIGN KEY (PaySlip_ID) 		REFERENCES PaySlip(PaySlip_ID)
);
GO

-- =================
-- Table: PS_ItemRSD
-- =================
CREATE TABLE PS_ItemRSD (
    OrderNmbr 		NVARCHAR(15) 							PRIMARY KEY,
    Date 	  		DATE 									NOT NULL,
    PS_RSD_ID 		INT 									NOT NULL,
    CONSTRAINT fk_PSItem_PS_RSD 							FOREIGN KEY (PS_RSD_ID) REFERENCES PS_RSD (PS_RSD_ID)
);
GO

-- ===================
-- Table: AllowanceRSD
-- ===================
CREATE TABLE AllowanceRSD (
    AllowanceID 	INT IDENTITY (1,1) 						PRIMARY KEY,
    Quantity 		INT 									NOT NULL,
    Amount 			DECIMAL (18,2) 							NOT NULL,
    OrderNmbr 		NVARCHAR(15) 							NOT NULL,
    CONSTRAINT fk_AllowanceRSD_OrderNmbr 					FOREIGN KEY (OrderNmbr) 	REFERENCES PS_ItemRSD (OrderNmbr)
);
GO

-- =================
-- Table: ExpenseRSD
-- =================
CREATE TABLE ExpenseRSD (
    ExpenseID 		INT IDENTITY (1,1) 						PRIMARY KEY,
    Amount 			DECIMAL (18,2) 							NOT NULL,
    OrderNmbr 		NVARCHAR(15) 							NOT NULL,
    CONSTRAINT fk_ExpenseRSD_OrderNmbr 						FOREIGN KEY (OrderNmbr) 	REFERENCES PS_ItemRSD (OrderNmbr)
);
GO

-- =============
-- Table: PS_EUR
-- =============
CREATE TABLE PS_EUR (
    PS_EUR_ID 		INT IDENTITY(1,1) 						PRIMARY KEY ,
	PaySlip_ID 		INT 									NOT NULL,
	CONSTRAINT fk_PS_EUR 									FOREIGN KEY (PaySlip_ID) 	REFERENCES PaySlip(PaySlip_ID)
);
GO

-- =================
-- Table: PS_ItemEUR
-- =================
CREATE TABLE PS_ItemEUR (
    OrderNmbr 		NVARCHAR(15) 							PRIMARY KEY,
    Date 			DATE 									NOT NULL,
    PS_EUR_ID 		INT 									NOT NULL,
    CONSTRAINT fk_PSItem_PS_EUR 							FOREIGN KEY (PS_EUR_ID) 	REFERENCES PS_EUR (PS_EUR_ID)
);
GO

-- ===================
-- Table: AllowanceEUR
-- ===================
CREATE TABLE AllowanceEUR (
    AllowanceID 	INT IDENTITY (1,1) 						PRIMARY KEY,
    Quantity 		INT 									NOT NULL,
    Amount 			DECIMAL (18,2) 							NOT NULL,
    OrderNmbr 		NVARCHAR(15) 							NOT NULL,
    CONSTRAINT fk_AllowanceEUR_OrderNmbr 					FOREIGN KEY (OrderNmbr) 	REFERENCES PS_ItemEUR (OrderNmbr)
);
GO

-- =================
-- Table: ExpenseEUR
-- =================
CREATE TABLE ExpenseEUR (
    ExpenseID 		INT IDENTITY (1,1) 						PRIMARY KEY,
    Amount 			DECIMAL (18,2) 							NOT NULL,
    OrderNmbr 		NVARCHAR(15) 							NOT NULL,
    CONSTRAINT fk_ExpenseEUR_OrderNmbr 						FOREIGN KEY (OrderNmbr) REFERENCES PS_ItemEUR (OrderNmbr)
);
GO

-- =================
-- Table: Inspection
-- =================
CREATE TABLE Inspection (
    InspectionID 	INT IDENTITY(1,1) 						PRIMARY KEY,
    Name 			NVARCHAR(100) 							NOT NULL,
    InspectionType 	NVARCHAR(10) 							NOT NULL

);
GO

-- ======================
-- Table: InspectionOther
-- ======================
CREATE TABLE InspectionOther(
InspectionID 	INT IDENTITY(1,1) 							PRIMARY KEY,
Name 			NVARCHAR(100) 								NOT NULL,
OldDate 		DATE 										NOT NULL,
NewDate 		DATE 										NOT NULL
);
GO

-- =========================
-- Table: EmployeeInspection
-- =========================
CREATE TABLE EmployeeInspection (
    ID 				INT 								IDENTITY(1,1) PRIMARY KEY,
    EmployeeID 		INT 								NOT NULL,
    InspectionID 	INT 								NOT NULL,
    OldDate 		DATE 								NOT NULL,
    NewDate 		DATE 								NOT NULL,
    CONSTRAINT fk_EmployeeInspection_EmployeeID 		FOREIGN KEY (EmployeeID) 
    REFERENCES Employee(EmplID),
    CONSTRAINT fk_EmployeeInspection_InspectionID 		FOREIGN KEY (InspectionID) 
    REFERENCES Inspection(InspectionID),
);
GO

-- ======================
-- Table: TruckInspection
-- ======================
CREATE TABLE TruckInspection (
    ID 				INT 							PRIMARY KEY IDENTITY(1,1),
    TruckID 		INT 							NOT NULL,
    InspectionID 	INT 							NOT NULL,
    OldDate 		DATE 							NOT NULL,
    NewDate 		DATE 							NOT NULL,
    CONSTRAINT fk_TruckInspection_TruckID 			FOREIGN KEY (TruckID) 
    REFERENCES Truck(TruckID),
    CONSTRAINT fk_TruckInspection_InspectionID 		FOREIGN KEY (InspectionID) 
    REFERENCES Inspection(InspectionID),
);
GO

-- ========================
-- Table: TrailerInspection
-- ========================
CREATE TABLE TrailerInspection (
    ID 				INT 							PRIMARY KEY IDENTITY(1,1),
    TrailerID 		INT 							NOT NULL,
    InspectionID 	INT 							NOT NULL,
    OldDate 		DATE 							NOT NULL,
    NewDate 		DATE 							NOT NULL,
    CONSTRAINT fk_TrailerInspection_TrailerID 		FOREIGN KEY (TrailerID) 
    REFERENCES Trailer(TrailerID),
    CONSTRAINT fk_TrailerInspection_InspectionID 	FOREIGN KEY (InspectionID) 
    REFERENCES Inspection(InspectionID),
);
GO

-- ====================
-- Table: CarInspection
-- ====================
CREATE TABLE CarInspection (
    ID 				INT IDENTITY(1,1) 				PRIMARY KEY,
    CarID 			INT 							NOT NULL,
    InspectionID 	INT 							NOT NULL,
    OldDate 		DATE 							NOT NULL,
    NewDate 		DATE 							NOT NULL,
    CONSTRAINT fk_CarInspection_CarID 				FOREIGN KEY (CarID) 
    REFERENCES Car(CarID),
    CONSTRAINT fk_CarInspection_InspectionID 		FOREIGN KEY (InspectionID) 
    REFERENCES Inspection(InspectionID),
);

GO


