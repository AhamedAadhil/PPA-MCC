import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, Phone, School, School2, User, Workflow } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import logo from '/assets/logo.png'
import {countries} from '../utils/countries'

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [batch, setBatch] = useState("");
	const [index, setIndex] = useState("");
	const [country, setCountry] = useState("");
	const [designation, setDesignation] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-3xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
		>	
			<div className='p-8'>
				<div className="flex justify-center items-center"><img src={logo} alt="ppa mcc logo" height={180} width={180}/></div>
				<h2 className='text-3xl font-bold mb-6 text-center bg-sky-300 text-transparent bg-clip-text'>
					Create Account
				</h2>

				<form onSubmit={handleSignUp}>
					<div className="grid grid-cols-2 gap-4">
					<Input
						icon={User}
						type='text'
						placeholder='Full Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						icon={School}
						type='text'
						placeholder='Batch'
						value={batch}
						onChange={(e) => setBatch(e.target.value)}
					/>
					<Input
						icon={School2}
						type='text'
						placeholder='School Index'
						value={index}
						onChange={(e) => setIndex(e.target.value)}
					/>				
					{/* <Input
						icon={Locate}
						type='text'
						placeholder='Country of Residence'
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					/> */}
					<div className="relative">
						<label htmlFor="country" className="sr-only">Country of Residence</label>
						<select
							id="country"
							className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
						>
							<option value="" disabled>Select Country</option>
							{countries.map((country,index) => (
								<option className="bg-gray-800 text-white" key={index} value={country.name}>
									{country.name}
								</option>
							))}
						</select>
					</div>
					<Input
						icon={Workflow}
						type='text'
						placeholder='Designation'
						value={designation}
						onChange={(e) => setDesignation(e.target.value)}
					/>
					<Input
						icon={Phone}
						type='text'
						placeholder='Phone Number (Whatsapp)'
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
					</div>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<div className="grid grid-cols-2 gap-4">					
					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Confirm Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					</div>
					{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
					<PasswordStrengthMeter password={password} />

					<motion.button
						className='mt-5 w-full py-3 px-4 bg-sky-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Already have an account?{" "}
					<Link to={"/login"} className='text-green-400 hover:underline'>
						Login
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default SignUpPage;
