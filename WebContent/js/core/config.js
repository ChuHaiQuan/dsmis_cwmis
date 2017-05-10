Ext.define('WJM.Config', {
	singleton : true,
	constructor : function(config) {
		this.callParent(arguments);
		this.user = window.user;
	},
	powerOperationModule : {
		"20" : {
			powerId : "20", moduleId : "stock", menuText : "Inventory/收货", moduleName : "WJM.stock.StockFormModel", iconClsBig : 'stock-shortcut'
		},
		"21" : {
			powerId : "21", moduleId : "invoice", menuText : "Invoice/销售", moduleName : "WJM.sale.SaleFormModel", iconClsBig : 'sale-shortcut'
		},
		"22" : {
			powerId : "22", moduleId : "cash", menuText : "cashier/支付", moduleName : "WJM.cash.CashierModel", iconClsBig : 'cash-shortcut'
		},
		"23" : {
			powerId : "23", moduleId : "RMA", menuText : "RMA/退货", moduleName : "WJM.rma.RmaModel", iconClsBig : 'rma-shortcut'
		},
		"24" : {
			powerId : "24", moduleId : "productsearch", menuText : "product&price search/产品及价格搜索", moduleName : "WJM.product.ProductSearchModel",
			iconClsBig : 'pricesearch-shortcut'
		},
		"25" : {
			powerId : "25", moduleId : "pricesearch", menuText : "price history/价格历史", iconClsBig : 'productsearch-shortcut',
			moduleName : "WJM.stock.PriceSearchModel"
		},
		"26" : {
			powerId : "26", moduleId : "purchase", menuText : "P.O.(General)/订货", moduleName : "WJM.purchase.PurchaseFormModel",
			iconClsBig : 'purchase-shortcut'
		},
		"27" : {
			powerId : "27", moduleId : "mysale", menuText : "My Invoice/我的销售", moduleName : "WJM.sale.MySaleModel", iconClsBig : 'sale-shortcut'
		},
		"28" : {
			powerId : "28", moduleId : "mypurchase", menuText : "My P.O./我的订货", moduleName : "WJM.purchase.MyPurchaseModel",
			iconClsBig : 'purchase-shortcut'
		},
		"29" : {
			powerId : "29", moduleId : "myquote", menuText : "My Estimate/我的报价", moduleName : "WJM.sale.MyQuoteModel",
			iconClsBig : 'sale-shortcut'
		},
		"40" : {
			powerId : "40", moduleId : "employee", menuText : "employee/员工", iconClsBig : 'employee-shortcut',
			moduleName : "WJM.employee.EmployeeManageModel"
		},
		"41" : {
			powerId : "41", moduleId : "vendor", menuText : "vendor/供货商", moduleName : "WJM.vendor.VendorManageModel",
			iconClsBig : 'vendor-shortcut'
		},
		"42" : {
			powerId : "42", moduleId : "customer", menuText : "customer/客户", moduleName : "WJM.customer.CustomerManageModel",
			iconClsBig : 'customer-shortcut'
		},
		"43" : {
			powerId : "43", moduleId : "product", menuText : "product/产品", moduleName : "WJM.product.ProductManageModel",
			iconClsBig : 'product-shortcut'
		},
		"44" : {
			powerId : "44", moduleId : "productcategory", menuText : "product category/产品种类",
			moduleName : "WJM.product.ProductCategoryManageModel", iconClsBig : 'productcategory-shortcut'
		},
		"45" : {
			powerId : "45", moduleId : "power", menuText : "permission/权限", iconClsBig : 'power-shortcut',
			moduleName : "WJM.power.PowerManageModel"
		},
		// "60" : {
		// powerId : "60", moduleId : "stockdetail", menuText : "stock detail/库存报表", moduleName : "WJM.stock.StockReportModel",
		// iconClsBig : 'stockdetail-shortcut'
		// },
		"61" : {
			powerId : "61", moduleId : "saledetail", menuText : "sale detail/销售报表", moduleName : "WJM.sale.SaleReportModel",
			iconClsBig : 'saledetail-shortcut'
		},
		"62" : {
			powerId : "62", moduleId : "purchasedetail", menuText : "purchase detail/购买报表", moduleName : "WJM.purchase.PurchaseReportModel",
			iconClsBig : 'purchasedetail-shortcut'
		},
		"100" : {
			powerId : "100", moduleId : "dailyreport", menuText : "daily report/日常报表", moduleName : "WJM.sale.SaleDailyReportModel",
			iconClsBig : 'dailyreport-shortcut'
		},
		"101" : {
			powerId : "101", moduleId : "monthlyreport", menuText : "monthly report/每月报表", moduleName : "WJM.sale.SaleMonthlyReportModel",
			iconClsBig : 'monthlyreport-shortcut'
		},
		"102" : {
			powerId : "102", moduleId : "reportbetween", menuText : "Sales Report Between/自选销售报表",
			moduleName : "WJM.sale.SaleBetweenReportModel", iconClsBig : 'reportbetween-shortcut'
		},
		"103" : {
			powerId : "103", moduleId : "damagereport", menuText : "damage report/损坏报表", moduleName : "WJM.rma.DamageReportModel",
			iconClsBig : 'monthlyreport-shortcut'
		},
		"120" : {
			powerId : "120", moduleId : "backup", menuText : "setting/设置", moduleName : "WJM.admin.BackUpModel", iconClsBig : 'backup-shortcut'
		},
		"121" : {
			powerId : "121", moduleId : "changepassword", menuText : "change password/修改密码", moduleName : "WJM.employee.ChangePasswordModel",
			iconClsBig : 'changepassword-shortcut'
		}
		,
		"122" : {
			powerId : "122", moduleId : "creditWarning", menuText : "past due report/超时付款报表", moduleName : "WJM.sale.CreditWarningModel",
			iconClsBig : 'saledetail-shortcut'
		}
	},
	/**
	 * 操作类型code
	 */
	operationPowerCode : [ 20, 21, 22, 23, 24, 25, 26, 27, 28, 29 ],
	/**
	 * 管理类型code
	 */
	adminPowerCode : [ 40, 41, 42, 43, 44, 45, 120, 121 ],
	// /**
	// * 报表类型code
	// */
	// reportPowerCode : [ 60, 61, 62, 100, 101, 102 ],
	/**
	 * 报表类型code
	 */
	reportPowerCode : [ 61, 62, 100, 101, 102, 103,122 ],

	defaultOperation : {
		success : function(batch, operation) {
			switch (operation.action) {
			case "create":
			case "update":
				Ext.MessageBox.alert('提示', '保存成功');
				break;
			case "destroy":
				Ext.MessageBox.alert('提示', '删除成功');
				break;
			default:
				break;
			}
		},

		failure : function(batch, operation) {
			switch (operation.action) {
			case "create":
			case "update":
				Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
				break;
			case "destroy":
				Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
				break;
			default:
				break;
			}
		}
	},
	/**
	 * 是否拥有操作菜单权限
	 */
	hasOperationMenu : function() {
		if (this.user.userPowers) {
			var array = Ext.Array.difference(Ext.Array.clone(this.operationPowerCode), this.user.userPowers);
			return array.length < this.operationPowerCode.length;
		}
		return false;
	},
	/**
	 * 是否拥有管理菜单权限
	 */
	hasAdminMenu : function(operationCode) {
		if (this.user.userPowers) {
			var array = Ext.Array.difference(Ext.Array.clone(this.adminPowerCode), this.user.userPowers);
			return array.length < this.operationPowerCode.length;
		}
		return false;
	},
	/**
	 * 是否拥有报表菜单权限
	 */
	hasReportMenu : function(operationCode) {
		if (this.user.userPowers) {
			var array = Ext.Array.difference(Ext.Array.clone(this.reportPowerCode), this.user.userPowers);
			return array.length < this.operationPowerCode.length;
		}
		return false;
	},
	/**
	 * 是否有产品管理的权限，可以看到进货价
	 */
	hasProductManageRole : function() {
		return Ext.Array.contains(this.user.userPowers, 43);
	}
});
