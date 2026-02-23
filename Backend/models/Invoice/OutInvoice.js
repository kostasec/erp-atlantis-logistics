const { sql, getPool } = require('../../util/db');

class OutInvoice {
    static async fetchAll() {
        const pool = await getPool();
        return pool.request().query(`
       SELECT
	          DocumentStatus,
	          ProcessingStatus, 
	          InvoiceNumber,
	          Recipient,
            DueDate,
            Currency,
	          CONCAT(
            FORMAT(SUM(TotalAmount), '#,###.##', 'de-DE'),
            ' ',
            MAX(Currency)
	          ) AS TotalInvoiceAmount,
	          PaymentStatusName
        FROM vw_OutgoingInvoiceServicesSummary
        GROUP BY DocumentStatus, ProcessingStatus, Recipient, InvoiceNumber, DueDate, Currency, PaymentStatusName
        `);
    }

    static async insert(reqBody, transaction){
        let {
            OutInvoiceNmbr,
            Currency,
            ReferenceNmbr,
            OrderNmbr,
            TransDate,
            IssueDate,
            DueDate,
            Attachment,
            Note,
            DocumentStatus,
            ProcessingStatus,
            PaymentStatus,
            TaxID,
            serviceItems = []
        } = reqBody;

    // 1) Insert u OutgoingInvoice
    const invoiceResult = await new sql.Request(transaction)
      .input('OutInvoiceNmbr', sql.VarChar(50), OutInvoiceNmbr)
      .input('Currency', sql.VarChar(10), Currency)
      .input('ReferenceNmbr', sql.VarChar(50), ReferenceNmbr)
      .input('OrderNmbr', sql.VarChar(50), OrderNmbr)
      .input('TransDate', sql.Date, TransDate)
      .input('IssueDate', sql.Date, IssueDate)
      .input('DueDate', sql.Date, DueDate)
      .input('Attachment', sql.NVarChar(500), Attachment)
      .input('Note', sql.VarChar(255), Note)
      .input('DocumentStatus', sql.Int, DocumentStatus)
      .input('ProcessingStatus', sql.Int, ProcessingStatus)
      .input('PaymentStatus', sql.Int, PaymentStatus)
      .input('TaxID', sql.VarChar(50), TaxID)
      .query(`
        INSERT INTO dbo.OutgoingInvoice (
          OutInvoiceNmbr, ReferenceNmbr, OrderNmbr,
          TransDate, IssueDate, DueDate,
          Attachment, Note,
          PaymentStatus, ProcessingStatus, TaxID, Currency, DocumentStatus
        )
        VALUES (
          @OutInvoiceNmbr, @ReferenceNmbr, @OrderNmbr,
          @TransDate, @IssueDate, @DueDate,
          @Attachment, @Note,
          @PaymentStatus, @ProcessingStatus, @TaxID, @Currency, @DocumentStatus
        );
        SELECT SCOPE_IDENTITY() AS InvoiceID;
      `);

    const invoiceID = invoiceResult.recordset[0].InvoiceID;

    // 2) Iteracija kroz serviceItems
    for (const s of serviceItems) {
      // 2a) Insert u Service
      const serviceResult = await new sql.Request(transaction)
        .input('ServiceType', sql.VarChar(20), s.ServiceType)
        .query(`
          INSERT INTO dbo.Service (ServiceType)
          VALUES (@ServiceType);
          SELECT SCOPE_IDENTITY() AS ServiceID;
        `);

      const serviceID = serviceResult.recordset[0].ServiceID;

      // 2b) Insert u odgovarajuću podtabelu
      if (s.ServiceType === 'Transportation') {
        await new sql.Request(transaction)
          .input('ServiceID', sql.Int, serviceID)
          .input('Route', sql.VarChar(100), s.Route)
          .input('Price', sql.Decimal(18, 2), s.Price)
          .input('TruckID', sql.Int, s.TruckID)
          .input('TrailerID', sql.Int, s.TrailerID)
          .query(`
            INSERT INTO dbo.TransportationService (ServiceID, Route, Price, TruckID, TrailerID)
            VALUES (@ServiceID, @Route, @Price, @TruckID, @TrailerID)
          `);
      } else if (s.ServiceType === 'Outsorcing') {
        await new sql.Request(transaction)
          .input('ServiceID', sql.Int, serviceID)
          .input('Route', sql.VarChar(100), s.Route)
          .input('Price', sql.Decimal(18, 2), s.Price)
          .input('RegTag', sql.VarChar(30), s.RegTag)
          .query(`
            INSERT INTO dbo.OutsorcingService (ServiceID, Route, Price, RegTag)
            VALUES (@ServiceID, @Route, @Price, @RegTag)
          `);
      } else if (s.ServiceType === 'Taxes') {
        await new sql.Request(transaction)
          .input('ServiceID', sql.Int, serviceID)
          .input('Name', sql.VarChar(100), s.Name)
          .input('Price', sql.Decimal(18, 2), s.Price)
          .query(`
            INSERT INTO dbo.TaxService (ServiceID, Name, Price)
            VALUES (@ServiceID, @Name, @Price)
          `);
      }

      // 2c) Insert u Item
      await new sql.Request(transaction)
        .input('InvoiceID', sql.Int, invoiceID)
        .input('ServiceID', sql.Int, serviceID)
        .input('Quantity', sql.Int, s.Quantity)
        .input('UoM', sql.VarChar(5), s.UoM)
        .input('VATCode', sql.VarChar(6), s.VATCode)
        .input('VATExamptionCode', sql.VarChar(50), s.VATExamptionCode)
        .query(`
          INSERT INTO dbo.Item (InvoiceID, ServiceID, Quantity, UoM, VATCode, VATExamptionCode)
          VALUES (@InvoiceID, @ServiceID, @Discount, @VATCode, @VATExamptionCode)
        `);
    }

    }
}


module.exports = OutInvoice;