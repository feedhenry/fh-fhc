#!/usr/bin/perl

use strict;
use warnings;

open( my $file, "<", "options2.txt" );
open( my $output, ">", "pre-match" ) or die $!;

while ( my $line = <$file> ) {
    if ( $line =~ m/^fhc/g ) {
        my ($output_name) = ( $line =~ m/^fhc\s(.*?)-/ );
        # change non alpha to dashes
        $output_name =~ s/[^\w]/-/g;
        $output_name =~ s/-$//;
        my $cmd_name=$output_name;
        $cmd_name  =~ s/-/ /g;
        print {$output} "----\n";
        close($output);
        open( $output, ">", $output_name . ".adoc" ) or die $!;
        print {$output} "[[$output_name]]\n";
        print {$output} "= $cmd_name\n";
        print {$output} "----\n";
    }
    print {$output} $line;
}

close($output);