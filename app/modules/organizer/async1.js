var serviceListResult = [];

func1(null, function () {
	func2(function () {
		res.render
	});
});

func1(param, callback) {
		serviceList.forEach(function (item, i) {
			db.query(`SELECT * from tblGenService WHERE
				LOWER(strServiceName) LIKE LOWER("%${item}%") 
				OR LOWER(strServiceName) LIKE LOWER("${item}%") 
				OR LOWER(strServiceName) LIKE LOWER("%${item}") 
				OR LOWER(strServiceDescription) LIKE LOWER("%${item}%") 
				OR LOWER(strServiceDescription) LIKE LOWER("${item}%") 
				OR LOWER(strServiceDescription) LIKE LOWER("%${item}")`,
				(err, results, fields) => {
					serviceListResult = serviceListResult.concat(results);
					if (i === serviceList.length - 1) callback();
				});
		});
}

func2() {
	
}