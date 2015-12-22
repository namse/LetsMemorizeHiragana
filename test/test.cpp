#include <fstream>
#include <string>
int main(){
	std::ifstream ifs("input.txt");
	std::ofstream ofs1("output1.txt");
	std::ofstream ofs2("output2.txt");
	while(ifs.good()){
		std::string hira;
		std::string english;
		std::string korean;
		ifs >> hira >> english >> korean;
		ofs1 << "\"" << hira << "\", ";
		ofs2 << "\"" << korean << "\", ";
	}
	ofs1 << std::endl;
	ofs2 << std::endl;
	
	return 1;
}