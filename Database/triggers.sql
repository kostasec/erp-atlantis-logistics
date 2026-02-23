-- =====================================================
-- Triger za tabelu Truck
-- =====================================================
CREATE TRIGGER tr_Truck_StatusUpdate
ON Truck
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    
    IF UPDATE(Status)
    BEGIN
       
        UPDATE c
        SET c.Status = i.Status
        FROM Composition c
        INNER JOIN inserted i ON c.TruckID = i.TruckID
        INNER JOIN deleted d ON d.TruckID = i.TruckID
        WHERE i.Status <> d.Status;
        
        
        UPDATE dc
        SET dc.Status = i.Status
        FROM DriverComposition dc
        INNER JOIN Composition c ON dc.CompositionID = c.CompositionID
        INNER JOIN inserted i ON c.TruckID = i.TruckID
        INNER JOIN deleted d ON d.TruckID = i.TruckID
        WHERE i.Status <> d.Status;
    END
END;
GO

-- =====================================================
-- Triger za tabelu Trailer
-- =====================================================
CREATE TRIGGER tr_Trailer_StatusUpdate
ON Trailer
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    
    IF UPDATE(Status)
    BEGIN
        
        UPDATE c
        SET c.Status = i.Status
        FROM Composition c
        INNER JOIN inserted i ON c.TrailerID = i.TrailerID
        INNER JOIN deleted d ON d.TrailerID = i.TrailerID
        WHERE i.Status <> d.Status;
        
        
        UPDATE dc
        SET dc.Status = i.Status
        FROM DriverComposition dc
        INNER JOIN Composition c ON dc.CompositionID = c.CompositionID
        INNER JOIN inserted i ON c.TrailerID = i.TrailerID
        INNER JOIN deleted d ON d.TrailerID = i.TrailerID
        WHERE i.Status <> d.Status;
    END
END;
GO

-- =====================================================
-- Triger za tabelu Employee
-- =====================================================
CREATE TRIGGER tr_Employee_StatusUpdate
ON Employee
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
  
    IF UPDATE(Status)
    BEGIN

        UPDATE dc
        SET dc.Status = i.Status
        FROM DriverComposition dc
        INNER JOIN inserted i ON dc.DriverID = i.EmplID
        INNER JOIN deleted d ON d.EmplID = i.EmplID
        WHERE i.Status <> d.Status;

    END
END;
GO

-- =====================================================
-- Triger za tabelu Employee - ažuriranje EmployeeCar
-- =====================================================
CREATE TRIGGER tr_Employee_EmployeeCar_StatusUpdate
ON Employee
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    
    IF UPDATE(Status)
    BEGIN
        
        UPDATE ec
        SET ec.Status = i.Status
        FROM EmployeeCar ec
        INNER JOIN inserted i ON ec.EmplID = i.EmplID
        INNER JOIN deleted d ON d.EmplID = i.EmplID
        WHERE i.Status <> d.Status;
        
		
    END
END;
GO

-- =====================================================
-- Triger za tabelu Car - ažuriranje EmployeeCar
-- =====================================================
CREATE TRIGGER tr_Car_StatusUpdate
ON Car
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    
    IF UPDATE(Status)
    BEGIN
        
        UPDATE ec
        SET ec.Status = i.Status
        FROM EmployeeCar ec
        INNER JOIN inserted i ON ec.CarID = i.CarID
        INNER JOIN deleted d ON d.CarID = i.CarID
        WHERE i.Status <> d.Status;
    END
END;
GO
