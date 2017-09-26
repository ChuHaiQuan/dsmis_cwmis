DELETE FROM tbuyer;
DELETE FROM tproduct;
DELETE FROM tcashhistory;
DELETE FROM temployee WHERE name!='admin';
DELETE FROM tinvoice;
DELETE FROM tinvoicehistory;
DELETE FROM tproduct_vendor;
DELETE FROM tproducttype;
DELETE FROM tprovider;
DELETE FROM tpurchase;
DELETE FROM tpurchaseproduct;
DELETE FROM tsale;
DELETE FROM tsalehistory;
DELETE FROM tsaleproduct;
DELETE FROM tstock;
DELETE FROM tstockproduct