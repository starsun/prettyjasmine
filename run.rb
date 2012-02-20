require 'watir-webdriver'

class TestRunner
  
  def initialize(dir)
    @dir = dir
  end

  def run
    files = retrieve_specs 

    @browser = Watir::Browser.new
    files.each do |file|
      run_test file
    end
    @browser.close
  end

  def retrieve_specs
    Dir.chdir @dir
    Dir.glob File.join('**', '*-test.js')
  end

  def run_test(file)
    puts "run test: #{file}"
    url = 'http://localhost/prettyjasmine/test.htm' 
    prefix = 'http://style.china.alibaba.com/app/winport/'
    query = "#{prefix}#{file}"
    
    @browser.goto "#{url}?#{query}" 
    div = @browser.element(:css => 'div.runner')
    div.wait_until_present

    Watir::Wait.until { div.class_name =~ /failed|passed/ }
    
    des = @browser.element(:css => 'a.description')
    puts des.text
  end

end

if $0 == __FILE__
  dir = ARGV[0] || '.'
  runner = TestRunner.new dir
  runner.run
end

