function getFibonacciNumberAtIndexRecursive () {
			var index = prompt("Please enter the Fibonacci index you want", "");
			document.getElementById("result").innerHTML = "Result: " + getFibonnaciRecursiveOptimized(index);
		}

		function getFibonnaci() {
			var index = prompt("Please enter the Fibonacci index you want", "");
			document.getElementById("result").innerHTML = "Result: " + getFibonacciNumberAtIndex(index);
		}

		// 1 , 1 , 2 , 3 , 5 , 8 , 13 , 21 , 34 , 55 , 89 , 144
		function getFibonacciNumberAtIndex (index) {
			if (index == 1 || index == 2) {
				return 1;
			}

			prevNum1 = 1, prevNum2 = 1;
			result = 0;

			for (i = 2 ; i < index ; i++) { 
				result = prevNum1 + prevNum2; 
				prevNum1 = prevNum2; 
				prevNum2 = result; 
			}	

			document.getElementById("result").innerHTML = "Result: " + result;
			return result;
		}

		// Unoptimized recursive function
		function getFibonnaciRecursive (index) {
			if (index == 1 || index == 2) {
				return 1;
			}

			return getFibonnaciRecursive(index - 1) + getFibonnaciRecursive(index - 2);
		}

		// optimized recursive function
		function getFibonnaciRecursiveOptimized(n) {
			var a = 1;
			var b = 0;
			var c = null;
			while (n > 0) {
				c = a;		
				a = b + a;   
				b = c;   	
				n--;
			}
			return b;
		}