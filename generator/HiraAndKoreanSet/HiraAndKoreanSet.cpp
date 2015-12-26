#include <fstream>
#include <string>
int main(){
	std::ifstream ifs("input.txt");
	std::ofstream ofs("output.txt");
	ofs << "{\n";
	while(ifs.good()){
		std::string hira;
		std::string english;
		std::string korean;
		ifs >> hira >> english >> korean;
		ofs << "\t\"" << hira << "\": \"" << korean << "\"";
		if(ifs.good()){
		    ofs << ",";
		}
		ofs << "\n";
	}
	ofs <<"}"<< std::endl;
	
	return 1;
}